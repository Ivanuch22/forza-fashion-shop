import { channels } from "@/const/channels";
import { UploadTrieveProductsListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { cookies } from "next/headers";
import { type ChunkReqPayload, TrieveSDK } from "trieve-ts-sdk";

export type TrieveProductMetadata = {
	name: string;
	description: string | null;
	slug: string;
	image_url: string | undefined;
	amount: number;
	currency: string;
	discount: string | number;
};

export async function POST(request: Request) {
	const datasetId = process.env.TRIEVE_DATASET_ID || ""; // Directly use process.env
	const apiKey = process.env.TRIEVE_API_KEY || "";
	if (!apiKey && !datasetId) return;
	const trieve = new TrieveSDK({ apiKey, datasetId });

	if (!datasetId || !apiKey) {
		console.error("Missing TRIEVE_API_KEY or TRIEVE_DATASET_ID");
		process.exit(1);
	}
	const generateTreview = await Promise.all(
		channels.map(async (channel) => {
			const getAllProducts = await executeGraphQL(UploadTrieveProductsListDocument, {
				variables: { first: 100, channel: channel.channel },
				revalidate: 60,
			});
			const products = getAllProducts.products?.edges ?? [];
			const chunks = products.flatMap(({ node: product }): ChunkReqPayload | ChunkReqPayload[] => {
				if (!product?.pricing?.priceRange?.start?.gross?.amount) {
					return [];
				}
				const link = product?.variants?.[0]
					? `/product/${product?.slug}?variant=${product?.variants[0]?.id}`
					: `/product/${product?.slug}`;

				return {
					chunk_html: `
	Product Name: ${product?.name}
	
	Description: ${product?.description}
	`.trim(),
					image_urls: product?.media?.map((media) => media.url) ?? [],
					tracking_id: `${product?.id}-${channel.channel}`,
					upsert_by_tracking_id: true,
					link,
					metadata: {
						name: product?.name,
						description: product?.description || "",
						slug: product?.slug,
						image_url: product?.media?.[0]?.url,
						amount: product?.pricing?.priceRange?.start?.gross.amount,
						currency: product?.pricing?.priceRange?.start?.gross.currency,
						discount: product?.pricing?.priceRangeUndiscounted?.start?.gross?.amount || "",
					} satisfies TrieveProductMetadata,
				};
			});

			const r = await trieve.createChunk(chunks);
			return r;
			console.log("Done", r);
		}),
	);
	return Response.json({ received: true, generateTreview });
}
