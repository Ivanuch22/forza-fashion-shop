// import { publicUrl } from "@/env.mjs";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { ProductList } from "@/ui/products/product-list";
// import * as Commerce from "commerce-kit";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

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
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	return {
		title: `${category?.seoTitle || category?.name || "Category"} · Saleor Storefront example`,
		description: category?.seoDescription || category?.description || category?.seoTitle || category?.name,
	};
};

export default async function CategoryPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!category || !category.products) {
		notFound();
	}
	const { products } = category;

	const t = await getTranslations("/category.page");

	return (
		<main className="pb-8">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{deslugify(params.slug)}
				<div className="text-lg font-semibold text-muted-foreground">{t("title")}</div>
			</h1>
			<ProductList products={products.edges.map((e) => e.node)} />
		</main>
	);
}
