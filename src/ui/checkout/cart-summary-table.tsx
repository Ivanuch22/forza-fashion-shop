"use client";
import type { CheckoutFindQuery } from "@/gql/graphql";
import { useTranslations } from "@/i18n/client";
import { formatMoney } from "@/lib/graphql";
import { CartAmountWithSpinner, CartItemLineTotal, CartItemQuantity } from "@/ui/checkout/cart-items.client";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/ui/shadcn/table";
import { YnsLink } from "@/ui/yns-link";
import Image from "next/image";
import { useOptimistic } from "react";

export const CartSummaryTable = ({
	cart,
	locale,
}: { cart: CheckoutFindQuery["checkout"]; locale: string }) => {
	console.log(cart, "CartSummaryTable");
	const t = useTranslations("/cart.page.summaryTable");

	const [optimisticCart, dispatchOptimisticCartAction] = useOptimistic(
		cart,
		(prevCart, action: { productId: string; action: "INCREASE" | "DECREASE" }) => {
			if (prevCart) {
				const modifier = action.action === "INCREASE" ? 1 : -1;

				return {
					...prevCart,
					lines: prevCart?.lines.map((line) => {
						if (line?.id === action?.productId) {
							return { ...line, quantity: line.quantity + modifier };
						}
						return line;
					}),
					id: prevCart?.id || "",
				};
			}
		},
	);

	const currency = cart?.totalPrice?.gross?.currency || "USD";
	const total = cart?.totalPrice?.gross?.amount ?? 0;

	return (
		<form>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="hidden w-24 sm:table-cell">
							<span className="sr-only">{t("imageCol")}</span>
						</TableHead>
						<TableHead className="">{t("productCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32">{t("priceCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32">{t("quantityCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32 text-right">{t("totalCol")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{optimisticCart?.lines.map((line) => {
						// @todo figure out what to do with this object; how to diplay it nicely
						// do some research
						// const _taxLine = optimisticCart.taxCalculation?.line_items?.data.find(
						// 	(taxLine) => taxLine.product === line.product.id,
						// );
						return (
							<TableRow key={line.id}>
								<TableCell className="hidden sm:table-cell sm:w-24">
									{line?.variant?.product?.thumbnail && (
										<Image
											className="aspect-square rounded-md object-cover"
											src={line?.variant?.product?.thumbnail.url}
											width={96}
											height={96}
											alt={line?.variant?.product?.thumbnail.alt || ""}
										/>
									)}
								</TableCell>
								<TableCell className="font-medium">
									<YnsLink
										className="transition-colors hover:text-muted-foreground"
										href={`/product/${line?.variant?.product?.slug}`}
									>
										{line?.variant?.name}
										{/* {formatProductName(line.product.name, line.product.metadata.variant)} */}
									</YnsLink>
								</TableCell>
								<TableCell>
									{formatMoney(line?.variant?.pricing?.price?.gross?.amount || 0, currency)}
								</TableCell>
								<TableCell>
									<CartItemQuantity
										cartId={cart?.id || ""}
										quantity={line.quantity}
										productId={line.id}
										onChange={dispatchOptimisticCartAction}
									/>
								</TableCell>
								<TableCell className="text-right">
									<CartItemLineTotal
										currency={currency}
										quantity={line.quantity}
										unitAmount={line?.totalPrice.gross.amount ?? 0}
										productId={line.id}
										locale={locale}
									/>
								</TableCell>
							</TableRow>
						);
					})}
					{/* TODO: shipping price */}
					{/* {cart.checkout && (
						<TableRow>
							<TableCell className="hidden sm:table-cell sm:w-24"></TableCell>
							<TableCell className="font-medium" colSpan={3}>
								{cart.shippingRate.display_name}{" "}
								<span className="text-muted-foreground">
									<FormatDeliveryEstimate estimate={cart.shippingRate.delivery_estimate} />
								</span>
							</TableCell>
							<TableCell className="text-right">
								{cart.shippingRate.fixed_amount &&
									formatMoney({
										amount: cart.shippingRate.fixed_amount.amount,
										currency: cart.shippingRate.fixed_amount.currency,
										locale,
									})}
							</TableCell>
						</TableRow>
					)} */}
				</TableBody>
				<TableFooter>
					{/* TODO: taxes */}
					{/* {optimisticCart.cart.taxBreakdown.map((tax, idx) => (
						<TableRow key={idx + tax.taxAmount} className="font-normal">
							<TableCell className="hidden w-24 sm:table-cell"></TableCell>
							<TableCell colSpan={3} className="text-right">
								{tax.taxType.toLocaleUpperCase()} {tax.taxPercentage}%
							</TableCell>
							<TableCell className="text-right">
								<CartAmountWithSpinner total={tax.taxAmount} currency={currency} locale={locale} />
							</TableCell>
						</TableRow>
					))} */}
					<TableRow className="text-lg font-bold">
						<TableCell className="hidden w-24 sm:table-cell"></TableCell>
						<TableCell colSpan={3} className="text-right">
							{t("totalSummary")}
						</TableCell>
						<TableCell className="text-right">
							<CartAmountWithSpinner total={total} currency={currency} locale={locale} />
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</form>
	);
};
