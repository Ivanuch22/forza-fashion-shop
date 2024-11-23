import { GetCategoryIdDocument, ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { Pagination } from "@/ui/Pagination";
import { ProductList } from "@/ui/products/product-list";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
// import { publicUrl } from "@/env.mjs";
// import * as Commerce from "commerce-kit";

// export const generateMetadata = async (props: {
// 	params: Promise<{ slug: string }>;
// }): Promise<Metadata> => {
// 	const params = await props.params;
// 	const products = await Commerce.productBrowse({
// 		first: 100,
// 		filter: { category: params.slug },
// 	});

// 	if (products.length === 0) {
// 		return notFound();
// 	}

// 	const t = await getTranslations("/category.metadata");

// 	return {
// 		title: t("title", { categoryName: deslugify(params.slug) }),
// 		alternates: { canonical: `${publicUrl}/category/${params.slug}` },
// 	};
// };

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const { category } = await executeGraphQL(GetCategoryIdDocument, {
		variables: { slug: params.slug }
	})
	return {
		title: `${category?.seoTitle || "Category"} · Saleor Storefront example`,
		description: category?.seoDescription || category?.name,
	};
};

export default async function CategoryPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ cursor?: string }>;
}) {
	const params = await props.params;
	const { category } = await executeGraphQL(GetCategoryIdDocument, {
		variables: { slug: params.slug }
	})
	const cursor = (await props.searchParams).cursor || ""
	const { products: getProducts } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: {
			first: 12,
			after: cursor,
			filter: {
				categories: [category?.id || ""]

			}
		},
		revalidate: 60,
	});
	const products = getProducts?.edges || []

	if (products.length == 0) {
		notFound();
	}
	return (
		<main className="pb-8">
			<h1 className="text-3xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				{deslugify(params.slug)}
			</h1>

			<p className="text-right text-[16px]">{category?.products?.totalCount || 0} products</p>
			<ProductList products={products.map((e) => e.node)} />
			<Pagination pageInfo={getProducts?.pageInfo} />

		</main>
	);
}
