import { publicUrl } from "@/env.mjs";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductsPerPage } from "@/lib/graphql";
import type { MetadataRoute } from "next";

// const Categories = [
// 	{ name: "Apparel", slug: "apparel" },
// 	{ name: "Accessories", slug: "accessories" },
// ];

type Item = MetadataRoute.Sitemap[number];
interface IProcutsUrls {
	url: string;
	lastModified: Date;
	changeFrequency: "daily" | "always" | "hourly" | "weekly" | "monthly" | "yearly" | "never" | undefined;
	priority: number;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// const products = await Commerce.productBrowse({ first: 100 });
	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			channel: "default-channel",
			first: ProductsPerPage,
			after: "",
		},
		revalidate: 60,
	});
	let productUrls: IProcutsUrls[] = [];
	if (products) {
		productUrls = products.edges.map(
			(product) =>
				({
					url: `${publicUrl}/product/${product.node.slug}`,
					lastModified: new Date(0 * 1000),
					changeFrequency: "daily",
					priority: 0.8,
				}) satisfies Item,
		);
	}

	// const categoryUrls = Categories.map(
	// 	(category) =>
	// 		({
	// 			url: `${publicUrl}/category/${category.slug}`,
	// 			lastModified: new Date(),
	// 			changeFrequency: "daily",
	// 			priority: 0.5,
	// 		}) satisfies Item,
	// );

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...productUrls,
		// ...categoryUrls,
	];
}
