import ProductVarians from "@/app/[locale]/(store)/product/[slug]/product-varians";
import EmblaCarousel from "@/app/[locale]/(store)/product/carousel/components/image-embela-carousel";
import Guarantee from "@/components/guarantee/guarantee";
import WhyChooseUs from "@/components/why-choose-us";
import {
	type Product,
	ProductDetailsDocument,
	ProductListDocument,
	type ProductVariant,
	type VariantDetailsFragment,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { mapLocaleToLanguageCode } from "@/lib/mapLocaleToLanguageCode";
import { deslugify, formatMoney, getStripeAmountFromDecimal } from "@/lib/utils";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/ui/shadcn/breadcrumb";
import { StickyBottom } from "@/ui/sticky-bottom";
import { YnsLink } from "@/ui/yns-link";
import edjsHTML from "editorjs-html";
import type { EmblaOptionsType } from "embla-carousel";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const parser = edjsHTML();

export async function generateMetadata(props: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const locale = params.locale || "en";
	const languageCode = mapLocaleToLanguageCode(locale);
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params?.slug),
			languageCode,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}
	const t = await getTranslations("/product.metadata");
	const productName = product.translation?.name || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;

	const title = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: t("title", { productName }),
		description: product.translation?.seoDescription || product.seoDescription || title,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/product/${encodeURIComponent(params.slug)}`
				: undefined,
		},
	};
}

export async function generateStaticParams() {
	const { products } = await executeGraphQL(ProductListDocument, {
		variables: { first: 100 },
		revalidate: 60,
	});

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";
	const t = await getTranslations("/product.page");
	const tg = await getTranslations("Global");
	const locale = params.locale || "en";
	const languageCode = mapLocaleToLanguageCode(locale);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			channel,
			slug: decodeURIComponent(params?.slug),
			languageCode,
		},
		revalidate: 60,
	});
	if (!product) {
		notFound();
	}

	const category = product.category;
	const variants = product.variants || [];
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID) || variants[0];
	const isAvailable = variants?.some((variant) => Boolean(variant.quantityAvailable)) ?? false;
	const rawDescription = product.translation?.description || product?.description;
	const parseDescription = rawDescription && JSON.parse(rawDescription);
	const description = parseDescription ? parser.parse(parseDescription as any) : "";
	const productName = product.translation?.name || product.name;
	const categoryName = category?.translation?.name || category?.name;
	const OPTIONS: EmblaOptionsType = {};

	return (
		<>
			<Breadcrumb className=" px-4 sm:px-6 lg:px-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="inline-flex min-h-12 min-w-12 items-center justify-center">
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink className="inline-flex min-h-12 min-w-12 items-center justify-center" asChild>
									<YnsLink href={`/category/${category.name.toLocaleLowerCase()}`}>{categoryName}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{productName}</BreadcrumbPage>
					</BreadcrumbItem>
					{selectedVariant && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{deslugify(selectedVariant.name)}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<StickyBottom
				selectedVariant={selectedVariant as VariantDetailsFragment}
				product={product}
				locale={locale}
			>
				<div className="mt-4 grid gap-4 lg:grid-cols-12 pb-5">
					<div className="lg:col-span-5 lg:col-start-7 row-start-2 lg:row-start-auto  px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{product.name}</h1>
						<div className="flex items-center">
							{selectedVariant?.pricing?.price?.gross.amount && (
								<p className="mt-2 text-2xl font-semibold leading-none tracking-tight  text-[rgb(189,_9,_27)]">
									{formatMoney({
										amount: getStripeAmountFromDecimal({
											amount: selectedVariant?.pricing?.price?.gross.amount,
											currency: selectedVariant?.pricing?.price?.gross.currency,
										}),
										currency: selectedVariant?.pricing?.price?.gross.currency,
										locale,
									})}
								</p>
							)}
							{selectedVariant?.pricing?.priceUndiscounted?.gross.amount !==
								selectedVariant?.pricing?.price?.gross.amount &&
								selectedVariant?.pricing?.priceUndiscounted?.gross.amount && (
									<p className="mt-2 text-lg line-through ml-2 font-semibold leading-none tracking-tight text-foreground/70">
										{formatMoney({
											amount: getStripeAmountFromDecimal({
												amount: selectedVariant?.pricing?.priceUndiscounted?.gross.amount,
												currency: selectedVariant?.pricing?.priceUndiscounted?.gross.currency,
											}),
											currency: selectedVariant?.pricing?.priceUndiscounted?.gross.currency,
											locale,
										})}
									</p>
								)}
						</div>
						<div className="mt-2">{!isAvailable && <div>{tg("addTocart.disabled")}</div>}</div>
					</div>

					<div className="lg:col-span-6 lg:row-span-3 lg:row-start-1">
						<h2 className="sr-only">{t("imagesTitle")}</h2>

						<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
							{product?.images?.length && (
								<div className="sm:px-6 lg:px-8">
									<EmblaCarousel slides={product?.images} options={OPTIONS} />
								</div>
							)}
						</div>
					</div>
					<div className="grid gap-8 lg:col-span-6  px-4 sm:px-6 lg:px-8">
						{variants.length > 1 && (
							<ProductVarians
								product={product as Product}
								selectedVariant={selectedVariant as ProductVariant}
								variants={variants as ProductVariant[]}
							/>
						)}
						<AddToCartButton
							disabled={!Boolean(selectedVariant) || !Boolean(selectedVariant?.quantityAvailable)}
							productId={selectedVariant?.id || ""}
						/>
						<section>
							<h2 className="sr-only">{t("descriptionTitle")}</h2>
							<div className="prose text-secondary-foreground">
								<div dangerouslySetInnerHTML={{ __html: description }}></div>
							</div>
						</section>
					</div>
				</div>
			</StickyBottom>
			<Guarantee />
			<WhyChooseUs />

			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</>
	);
}
