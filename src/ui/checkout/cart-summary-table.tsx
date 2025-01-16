// @ts-nocheck
"use client";
import type { CheckoutFindQuery, CheckoutLine } from "@/gql/graphql";
import { formatMoney } from "@/lib/graphql";
import { CheckoutSummary } from "@/ui/checkout/cart-summary";
import Image from "next/image";
import { useOptimistic } from "react";

export const ProductCard = ({ line }: { line: CheckoutLine }) => {
	return (
		<div className="flex items-center justify-between border-b border-gray-200 py-4 px-1">
			<div className="flex items-center gap-4">
				<div className="w-16 h-16 border relative border-solid border-[hsl(0,0%,93%)] rounded-[5px] ">
					<div className="absolute  top-[-10px] right-[-10px] w-[20px] h-[20px] rounded-full bg-[hsl(0,0%,40%)] text-white flex justify-center items-center text-[14px] font-bold ">
						{line?.quantity}
					</div>
					{line?.variant.product.thumbnail?.url && (
						<Image
							className="w-full h-full object-cover rounded"
							alt={line?.variant.product.thumbnail?.alt || `product images ${line.variant.product.name}`}
							src={line?.variant.product.thumbnail?.url}
							width={50}
							height={50}
						/>
					)}
				</div>
				<div>
					<h3 className="text-sm font-medium text-gray-900">{line?.variant.product.name}</h3>
					<p className="text-sm text-gray-500 max-w-[170px]">{line?.variant.name}</p>
				</div>
			</div>
			<div className="text-sm font-normal grid text-gray-900">
				{line?.undiscountedTotalPrice?.amount !== line?.totalPrice.gross.amount &&
					line?.undiscountedTotalPrice?.amount && (
						<span className="text-xs text-right line-through ">
							{line?.undiscountedTotalPrice?.amount &&
								formatMoney(
									line?.undiscountedTotalPrice?.amount || 0,
									line?.undiscountedTotalPrice?.currency || "",
								)}
						</span>
					)}
				<span>
					{line?.totalPrice.gross.amount &&
						formatMoney(line?.totalPrice.gross.amount || 0, line?.totalPrice.gross.currency || "")}
				</span>
			</div>
		</div>
	);
};

export const CartSummaryTable = ({ cart }: { cart: CheckoutFindQuery["checkout"]; locale: string }) => {
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

	return (
		<div>
			{optimisticCart?.lines.map((line, idx) => (
				<ProductCard line={line} key={line.id + idx} />
			))}
			<CheckoutSummary cart={cart} />
		</div>
	);
};
