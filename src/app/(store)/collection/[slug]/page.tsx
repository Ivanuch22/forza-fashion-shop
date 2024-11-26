import { GetCollectionIdDocument, ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { Pagination } from "@/ui/Pagination";
import { ProductList } from "@/ui/products/product-list";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";

	const { collection } = await executeGraphQL(GetCollectionIdDocument, {
		variables: { slug: params.slug, channel },
	});
	return {
		title: `${collection?.seoTitle || "collection"} · Saleor Storefront example`,
		description: collection?.seoDescription || collection?.name,
	};
};

export default async function CollectionPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ cursor?: string }>;
}) {
	const params = await props.params;
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";

	const { collection } = await executeGraphQL(GetCollectionIdDocument, {
		variables: { slug: params.slug, channel },
	});

	const cursor = (await props.searchParams).cursor || "";
	const { products: getProducts } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: {
			first: 12,
			after: cursor,
			channel,
			filter: {
				collections: [collection?.id || ""],
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
				{deslugify(params.slug)}
			</h1>

			<p className="text-right text-[16px]">{collection?.products?.totalCount || 0} products</p>
			<ProductList products={products.map((e) => e.node)} />
			<Pagination pageInfo={getProducts?.pageInfo} />
		</main>
	);
}
