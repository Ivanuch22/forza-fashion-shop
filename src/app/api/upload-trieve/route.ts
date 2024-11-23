import { TrieveSDK, type ChunkReqPayload } from "trieve-ts-sdk";
import { executeGraphQL } from "@/lib/graphql";
import { UploadTrieveProductsListDocument } from "@/gql/graphql";
import type { TrieveProductMetadata } from "@/scripts/upload-trieve";

export async function POST(request: Request) {
  const datasetId = process.env.TRIEVE_DATASET_ID || "";  // Directly use process.env
  const apiKey = process.env.TRIEVE_API_KEY || "";
  if (!apiKey && !datasetId) return
  const trieve = new TrieveSDK({ apiKey, datasetId });

  if (!datasetId || !apiKey) {
    console.error("Missing TRIEVE_API_KEY or TRIEVE_DATASET_ID");
    process.exit(1);
  }

  // Fetch products and process them
  const getAllProducts = await executeGraphQL(UploadTrieveProductsListDocument, {
    variables: { first: 100 },
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
        discount: product?.pricing?.priceRangeUndiscounted?.start?.gross?.amount || "",
      } satisfies TrieveProductMetadata,
    };
  });

  const r = await trieve.createChunk(chunks);

  console.log("Done", r);

  return Response.json({ received: true });
}