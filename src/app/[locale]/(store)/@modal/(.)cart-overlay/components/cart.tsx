"use client";
import DeleteButton from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/delete-button";
import Loading from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/loading";
import QuantityChanges from "@/app/[locale]/(store)/@modal/(.)cart-overlay/quantity-change";
import type { CheckoutLine } from "@/gql/graphql";
import { deleteItem, updateCart } from "@/lib/checkout";
import { formatMoney } from "@/lib/graphql";
import { YnsLink } from "@/ui/yns-link";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import Image from "next/image";
import { useState } from "react";
const Cart = ({ line, checkoutId }: { line: CheckoutLine; checkoutId: string }) => {
	const { changeCheckout } = useCheckoutStore((state) => state);
	const [loading, setLoading] = useState(false);
	const onDelete = async () => {
		setLoading(true);
		const deleteLine = await deleteItem(checkoutId, line?.id);
		if (deleteLine?.checkout) {
			changeCheckout(deleteLine.checkout);
		}
		setLoading(false);
		console.log(deleteLine);
	};
	const onPlus = async () => {
		setLoading(true);
		const updateLineQnt = await updateCart(checkoutId, [{ ...line, quantity: line.quantity + 1 }]);
		setLoading(false);
		console.log(updateLineQnt);
		if (updateLineQnt?.checkout) {
			console.log(updateLineQnt);
			changeCheckout(updateLineQnt.checkout);
		}
	};
	const onMinus = async () => {
		setLoading(true);
		const updateLineQnt = await updateCart(checkoutId, [{ ...line, quantity: line.quantity - 1 }]);
		setLoading(false);
		console.log(updateLineQnt);
		if (updateLineQnt?.checkout) {
			changeCheckout(updateLineQnt.checkout);
		}
	};
	return (
		<li key={line.id} className="grid relative grid-cols-[74px,max-content] gap-x-3 py-6">
			{line?.variant?.product?.thumbnail?.url ? (
				<YnsLink href={`/product/${line?.variant.product.slug}`}>
					<div className="flex justify-center items-center h-[74px] w-[74px]  bg-neutral-100 ">
						<Image
							className="aspect-square rounded-md object-cover"
							src={line?.variant?.product?.thumbnail?.url}
							width={80}
							height={80}
							alt=""
						/>
					</div>
				</YnsLink>
			) : (
				<div className="flex justify-center items-center h-[74px] w-[74px] " />
			)}
			<div className="max-w-[200px]">
				<YnsLink href={`/product/${line?.variant.product.slug}`}>
					<h3 className="-mt-1 font-bold leading-tight text-[18px] mb-[5px]">
						{line?.variant?.product?.name || ""}
					</h3>
				</YnsLink>
				<p className="text-[16px] mb-[5px]">{line?.variant?.name || ""}</p>
				{line && <QuantityChanges onMinus={onMinus} onPlus={onPlus} line={line} />}
			</div>
			<div className="absolute right-[10px] w-[15px] h-[15px] overflow-hidden flex justify-center items-center top-[25px]">
				<DeleteButton onClick={onDelete} />{" "}
			</div>
			{line?.undiscountedTotalPrice?.amount !== line?.totalPrice.gross.amount &&
				line?.undiscountedTotalPrice?.amount && (
					<p className="absolute bottom-[40px]  right-[10px] text-gray-500  text-[16px] font-semibold line-through leading-none">
						{formatMoney(line.undiscountedTotalPrice?.amount, line.undiscountedTotalPrice?.currency)}
					</p>
				)}
			<p className="absolute bottom-[20px]  right-[10px] text-[rgb(189,9,27)]  text-[20px] font-bold leading-none">
				{line.totalPrice?.gross?.amount &&
					line.totalPrice?.gross?.currency &&
					formatMoney(line.totalPrice?.gross?.amount, line.totalPrice?.gross?.currency)}
			</p>
			{loading && <Loading />}
		</li>
	);
};
export default Cart;
