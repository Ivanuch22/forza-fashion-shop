import { GetCategoryIdDocument, ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { mapLocaleToLanguageCode } from "@/lib/mapLocaleToLanguageCode";
import { Pagination } from "@/ui/Pagination";
import { ProductList } from "@/ui/products/product-list";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";

	const { category } = await executeGraphQL(GetCategoryIdDocument, {
		variables: { slug: params.slug, channel, languageCode: mapLocaleToLanguageCode(params.locale) },
	});
	return {
		title: `${category?.seoTitle || "Category"} · Saleor Storefront example`,
		description: category?.seoDescription || category?.name,
	};
};

export default async function CategoryPage(props: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ cursor?: string }>;
}) {
	const cookie = await cookies();
	const params = await props.params;
	const t = await getTranslations("/category");
	const cursor = (await props.searchParams).cursor || "";
	const channel = cookie.get("channel")?.value || "default-channel";
	const { category } = await executeGraphQL(GetCategoryIdDocument, {
		variables: { slug: params.slug, channel, languageCode: mapLocaleToLanguageCode(params.locale) },
	});
	const categoryName = category?.translation?.name || category?.name;

	const { products: getProducts } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: {
			first: 12,
			after: cursor,
			channel,
			filter: {
				categories: [category?.id || ""],
			},
		},
		revalidate: 60,
	});
	const products = getProducts?.edges || [];

	if (products.length == 0) {
		notFound();
	}
	return (
		<main className="pb-8">
			<h1 className="text-3xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				{categoryName}
			</h1>
			<p className="text-right text-[16px]">
				{t("slug.products", { count: category?.products?.totalCount || 0 })}
			</p>
			<ProductList products={products.map((e) => e.node)} />
			<Pagination pageInfo={getProducts?.pageInfo} />
		</main>
	);
}
