import { UploadTrieveProductsListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import NextEnv from "@next/env";

import { type ChunkReqPayload, TrieveSDK } from "trieve-ts-sdk";
NextEnv.loadEnvConfig(".");

const { env } = await import("@/env.mjs");

const datasetId = env.TRIEVE_DATASET_ID;
const apiKey = env.TRIEVE_API_KEY;

if (!datasetId || !apiKey) {
	console.error("Missing TRIEVE_API_KEY or TRIEVE_DATASET_ID");
	process.exit(1);
}

export const trieve = new TrieveSDK({ apiKey, datasetId });

// Замість Stripe тепер отримуємо продукти з Saleor
const getAllProducts = await executeGraphQL(UploadTrieveProductsListDocument, { variables: { first: 500 }, revalidate: 60 });

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
		image_urls: product?.media?.map(media => media.url) ?? [],
		tracking_id: product?.id,
		upsert_by_tracking_id: true,
		link,
		metadata: {
			name: product?.name,
			description: product?.description || "",
			slug: product?.slug,
			image_url: product?.media?.[0]?.url,
			amount: product?.pricing?.priceRange?.start?.gross.amount,
			currency: product?.pricing?.priceRange?.start?.gross.currency,
			discount: product?.pricing?.priceRange?.start?.gross.currency,
		} satisfies TrieveProductMetadata,
	};
});

const r = await trieve.createChunk(chunks);

console.log("Done", r);

export type TrieveProductMetadata = {
	name: string;
	description: string | null;
	slug: string;
	image_url: string | undefined;
	amount: number;
	currency: string;
	discount: string | number;
};