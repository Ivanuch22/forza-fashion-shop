import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoney, getStripeAmountFromDecimal } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { getLocale } from "next-intl/server";
import Image from "next/image";

export const ProductList = async ({ products }: { products: ProductListItemFragment[] }) => {
	const locale = await getLocale();
	return (
		<>
			<ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
				{products.map((product, idx) => {
					return (
						<li key={product?.id} className="group">
							<YnsLink href={`/product/${product?.slug}`}>
								<article className="min-h-full overflow-hidden rounded border bg-white">
									{product?.thumbnail?.url && (
										<div className="aspect-square w-full overflow-hidden bg-neutral-100">
											<Image
												className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
												src={product?.thumbnail?.url}
												width={768}
												height={768}
												loading={idx < 3 ? "eager" : "lazy"}
												priority={idx < 3}
												sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
												alt=""
											/>
										</div>
									)}
									<div className="p-4">
										<h2 className="text-base md:text-lg font-semibold text-neutral-700">{product?.name}</h2>
										<footer className="flex-wrap text-sm font-medium text-neutral-900 flex items-center gap-2">
											{product?.pricing?.priceRange?.start?.gross?.amount && (
												<p>
													{formatMoney({
														amount: getStripeAmountFromDecimal({
															amount: product?.pricing?.priceRange?.start?.gross?.amount,
															currency: product?.pricing?.priceRange?.start?.gross?.currency,
														}),
														currency: product?.pricing?.priceRange?.start?.gross?.currency,
														locale,
													})}
												</p>
											)}
											{product?.pricing?.priceRangeUndiscounted?.start?.gross?.amount !==
												product?.pricing?.priceRange?.start?.gross.amount &&
												product?.pricing?.priceRangeUndiscounted?.start?.gross?.amount && (
													<p className="text-xs line-through ">
														{formatMoney({
															amount: getStripeAmountFromDecimal({
																amount: product?.pricing?.priceRangeUndiscounted?.start?.gross?.amount,
																currency: product?.pricing?.priceRangeUndiscounted?.start?.gross?.currency,
															}),
															currency: product?.pricing?.priceRangeUndiscounted?.start?.gross?.currency,
															locale,
														})}
													</p>
												)}
										</footer>
									</div>
								</article>
							</YnsLink>
						</li>
					);
				})}
			</ul>
			{/* <JsonLd jsonLd={mappedProductsToJsonLd(products)} /> */}
		</>
	);
};
