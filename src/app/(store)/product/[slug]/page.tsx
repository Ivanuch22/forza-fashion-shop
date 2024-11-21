// @ts-nocheck

import { publicUrl } from "@/env.mjs";
import { ProductDetailsDocument, ProductListDocument } from "@/gql/graphql";
import { getLocale, getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import { getRecommendedProducts } from "@/lib/search/trieve";

import { cn, deslugify, formatMoney, getStripeAmountFromDecimal } from "@/lib/utils";
import type { TrieveProductMetadata } from "@/scripts/upload-trieve";
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

import EmblaCarousel from "@/modules/product/components/image-embela-carousel";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import edjsHTML from "editorjs-html";
import type { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import { notFound } from "next/navigation";

const parser = edjsHTML();

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params?.slug),
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}
	const t = await getTranslations("/product.metadata");

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;

	const title = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: t("title", { productName }),
		description: product.seoDescription || title,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/product/${encodeURIComponent(params.slug)}`
				: undefined,
		},
	};
}

export async function generateStaticParams() {
	const { products } = await executeGraphQL(ProductListDocument, { revalidate: 60 });

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params?.slug),
		},
		revalidate: 60,
	});
	console.log(product)
	if (!product) {
		notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();
	const category = product.category;

	const variants = product.variants || [];
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID) || variants[0];
	const isAvailable = variants?.some((variant) => Boolean(variant.quantityAvailable)) ?? false;
	const parseDescription = product?.description && JSON.parse(product?.description);
	const description = product?.description ? parser.parse(parseDescription) : "";

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
									<YnsLink href={`/category/${category.name.toLocaleLowerCase()}`}>
										{deslugify(category?.name)}
									</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
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

			<StickyBottom selectedVariant={selectedVariant} product={product} locale={locale}>
				<div className="mt-4 grid gap-4 lg:grid-cols-12">
					<div className="lg:col-span-5 lg:col-start-7 row-start-2 lg:row-start-auto  px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{product.name}</h1>
						<div className="flex items-center">
							{selectedVariant?.pricing?.price?.gross.amount && (
								<p className="mt-2 text-2xl font-medium leading-none tracking-tight text-foreground/70 text-[rgb(189,_9,_27)]">
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
							{selectedVariant?.pricing?.priceUndiscounted?.gross.amount && (
								<p className="mt-2 text-xl line-through ml-2 font-medium leading-none tracking-tight text-foreground/70 text-[rgb(189,_9,_27)]">
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
						<div className="mt-2">{!isAvailable && <div>Out of stock</div>}</div>
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
							<div className="grid gap-2">
								<p className="text-base font-medium" id="variant-label">
									{t("variantTitle")}
								</p>
								<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
									{variants.map((variant) => {
										const isSelected = selectedVariant?.name === variant.name;
										return (
											variant.id && (
												<li key={variant.id}>
													<YnsLink
														scroll={false}
														prefetch={true}
														href={`/product/${product.slug}?variant=${variant.id}`}
														className={cn(
															"flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-neutral-100",
															isSelected && "border-black bg-neutral-50 font-medium",
														)}
														aria-selected={isSelected}
													>
														{deslugify(variant.name)}
													</YnsLink>
												</li>
											)
										);
									})}
								</ul>
							</div>
						)}
						<AddToCartButton
							disabled={!selectedVariant || !selectedVariant?.quantityAvailable}
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

			{/* <Suspense>
				<SimilarProducts id={product.id} />
			</Suspense> */}

			{/* <JsonLd jsonLd={mappedProductToJsonLd(product)} /> */}
		</>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	const products = await getRecommendedProducts({ productId: id, limit: 4 });

	if (!products) {
		return null;
	}

	return (
		<section className="py-12">
			<div className="mb-8">
				<h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => {
					const trieveMetadata = product.metadata as TrieveProductMetadata;
					return (
						<div key={product.tracking_id} className="bg-card rounded overflow-hidden shadow group">
							{trieveMetadata.image_url && (
								<YnsLink href={`${publicUrl}${product.link}`} className="block" prefetch={false}>
									<Image
										className={
											"w-full rounded-lg bg-neutral-100 object-cover object-center group-hover:opacity-80 transition-opacity"
										}
										src={trieveMetadata.image_url}
										width={300}
										height={300}
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
										alt=""
									/>
								</YnsLink>
							)}
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">
									<YnsLink href={product.link || "#"} className="hover:text-primary" prefetch={false}>
										{trieveMetadata.name}
									</YnsLink>
								</h3>
								<div className="flex items-center justify-between">
									<span>
										{formatMoney({
											amount: trieveMetadata.amount,
											currency: trieveMetadata.currency,
										})}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
