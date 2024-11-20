import type { ProductDetailsQuery } from "@/gql/graphql";
import { formatProductName } from "@/lib/utils";
import type * as Commerce from "commerce-kit";
import { getDecimalFromStripeAmount } from "commerce-kit/currencies";
import type { ItemList, Product, Thing, WebSite, WithContext } from "schema-dts";
import type Stripe from "stripe";

export const JsonLd = <T extends Thing>({ jsonLd }: { jsonLd: WithContext<T> }) => {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

export const mappedProductToJsonLd = (product: ProductDetailsQuery["product"]): WithContext<Product> => {
	const variants = product?.variants || [];
	const productName = formatProductName(product?.name || "", variants[0] ? variants[0]?.name : "");
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: productName,
		image: product?.images ? product?.images.map((image) => image.url) : [],
		description: product?.description ?? undefined,
		sku: variants[0]?.sku || "",
		offers: {
			"@type": "Offer",
			price: getDecimalFromStripeAmount({
				amount: variants[0]?.pricing?.price?.gross?.amount ?? 0,
				currency: variants[0]?.pricing?.price?.gross?.currency || "",
			}),
			priceCurrency: variants[0]?.pricing?.price?.gross?.currency,
			availability:
				(variants[0]?.quantityAvailable ?? 0 > 0)
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
		},
	};
};

export const mappedProductsToJsonLd = (
	products: readonly ProductDetailsQuery["product"][],
): WithContext<ItemList> => {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: products.map(mappedProductToJsonLd),
	};
};

export const accountToWebsiteJsonLd = ({
	account,
	logoUrl,
}: {
	account: Stripe.Account | null | undefined;
	logoUrl: string | null | undefined;
}): WithContext<WebSite> => {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: account?.business_profile?.name ?? "Your Next Store",
		url: account?.business_profile?.url ?? "https://yournextstore.com",
		mainEntityOfPage: {
			"@type": "WebPage",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
		...(logoUrl && {
			image: {
				"@type": "ImageObject",
				url: logoUrl,
			},
		}),
		publisher: {
			"@type": "Organization",
			name: account?.business_profile?.name ?? "Your Next Store",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
	};
};
