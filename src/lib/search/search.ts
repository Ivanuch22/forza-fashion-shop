import { ProductListSearchDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { unstable_cache } from "next/cache";

export const searchProducts = unstable_cache(
	async (query: string) => {
		const { products } = await executeGraphQL(ProductListSearchDocument, {
			variables: {
				searchTerm: query,
				channel: "",
				first: 100,
			},
			revalidate: 60,
		});
		return products?.edges.map((p) => p.node);
	},
	["search", "products"],
	{
		tags: ["search", "products"],
	},
);
