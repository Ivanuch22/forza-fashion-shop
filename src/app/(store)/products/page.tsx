import { publicUrl } from "@/env.mjs";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { ProductsPerPage, executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/Pagination";
import { ProductList } from "@/ui/products/product-list";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/products.metadata");
	return {
		title: t("title"),
		alternates: { canonical: `${publicUrl}/products` },
	};
};
// Тип для параметрів запиту
type Props = {
	searchParams: {
		cursor: string;
	};
};

export default async function AllProductsPage({ searchParams }: Props) {
	const t = await getTranslations("/products.page");
	const { cursor } = searchParams;
	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: cursor,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	return (
		<main className="pb-8">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{t("title")}</h1>
			<ProductList products={products.edges.map((e) => e.node)} />
			<Pagination pageInfo={products.pageInfo} />
		</main>
	);
}
