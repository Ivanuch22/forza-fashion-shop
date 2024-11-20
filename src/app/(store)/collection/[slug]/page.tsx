import { ProductListByCollectionDocument } from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { ProductList } from "@/ui/products/product-list";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, first: 50 },
		revalidate: 60,
	});

	return {
		title: `${collection?.seoTitle || collection?.name || "Category"} · Saleor Storefront example`,
		description:
			collection?.description || collection?.description || collection?.seoTitle || collection?.name,
	};
};

export default async function CollectionPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!collection || !collection.products) {
		notFound();
	}
	const { products } = collection;

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
