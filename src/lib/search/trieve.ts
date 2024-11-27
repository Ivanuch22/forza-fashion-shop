import { env } from "@/env.mjs";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { TrieveSDK } from "trieve-ts-sdk";

const apiKey = env.TRIEVE_API_KEY;
const datasetId = env.TRIEVE_DATASET_ID;

export const trieve = apiKey && datasetId ? new TrieveSDK({ apiKey, datasetId }) : null;
export const getRecommendedProducts = cache(
	({
		productId,
		limit,
		channel,
		currency,
	}: { productId: string; limit: number; channel: string; currency: string }) =>
		unstable_cache(
			async () => {
				if (!trieve) {
					return null;
				}
				try {
					console.log(productId);
					const response = await trieve.getRecommendedChunks({
						positive_tracking_ids: [`${productId}-${channel}`],
						strategy: "best_score",
						recommend_type: "bm25",
						limit,
						filters: {
							must: [
								{
									field: "metadata.currency",
									match_any: [currency],
								},
							],
						},
					});
					console.log("sldfkj response");

					const chunks = Array.isArray(response) ? null : response.chunks;
					if (!chunks) {
						return null;
					}

					const products = chunks.flatMap((chunk) => {
						if ("metadata" in chunk.chunk && chunk.chunk.metadata) {
							return chunk.chunk;
						}
						return [];
					});
					return products;
				} catch (error) {
					console.error(error);
					return null;
				}
			},
			[`getRecommendedProducts-${productId}-${limit}-${channel}-${currency}`],
			{
				tags: ["getRecommendedProducts", `getRecommendedProducts-${productId}`],
			},
		)(),
);
