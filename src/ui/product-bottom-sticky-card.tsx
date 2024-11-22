import type { ProductDetailsQuery, VariantDetailsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import { MainProductImage } from "@/ui/products/main-product-image";
import { formatMoney, getStripeAmountFromDecimal } from "commerce-kit/currencies";

export const ProductBottomStickyCard = ({
	product,
	locale,
	selectedVariant,
	show,
}: {
	selectedVariant: VariantDetailsFragment;
	product: ProductDetailsQuery["product"];
	locale: string;
	show: boolean;
}) => {
	return (
		<div
			tabIndex={show ? 0 : -1}
			className={cn(
				"fixed bottom-0 max-w-[100vw] left-0 right-0 bg-white/90 backdrop-blur-sm border-t py-2 sm:py-4 transition-all duration-300 ease-out z-10",
				show
					? "transform translate-y-0 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1),_0_-2px_4px_-2px_rgb(0_0_0_/_0.1)]"
					: "transform translate-y-full",
			)}
		>
			<div className="mx-auto w-full max-w-7xl gap-x-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
				<div className="flex items-center gap-x-2 sm:gap-x-4 min-w-0">
					<div className="shrink-0">
						{product?.images?.length && product?.images[0]?.url && (
							<MainProductImage
								className="w-16 h-16 rounded-lg bg-neutral-100 object-cover object-center"
								src={product?.images[0]?.url}
								loading="eager"
								priority
								alt={product?.images[0]?.alt || `By ${product.name}`}
							/>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-xs sm:text-base md:text-lg whitespace-nowrap text-ellipsis overflow-clip">
							{product?.name}
						</h3>

						{selectedVariant?.pricing?.price?.gross?.amount && (
							<p className="text-xs sm:text-sm text-[rgb(189,_9,_27)]">
								{formatMoney({
									amount: getStripeAmountFromDecimal({
										amount: selectedVariant?.pricing?.price?.gross?.amount,
										currency: selectedVariant?.pricing?.price?.gross?.currency,
									}),
									currency: selectedVariant?.pricing?.price?.gross?.currency,
									locale,
								})}
							</p>
						)}
					</div>
				</div>
				{selectedVariant?.pricing?.price?.gross?.amount && (
					<AddToCartButton
						productId={!product?.variants ? "" : product?.variants[0]?.id || ""}
						disabled={Boolean(product?.variants && !product?.variants[0]?.quantityAvailable)}
					/>
				)}
			</div>
		</div>
	);
};
