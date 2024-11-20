"use client";
import DeleteButton from "@/app/(store)/@modal/(.)cart-overlay/components/delete-button";
import Loading from "@/app/(store)/@modal/(.)cart-overlay/components/loading";
import QuantityChanges from "@/app/(store)/@modal/(.)cart-overlay/quantity-change";
import type { CheckoutLine } from "@/gql/graphql";
import { deleteItem, updateCart } from "@/lib/checkout";
import { formatMoney } from "@/lib/graphql";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import Image from "next/image";
import Link from "next/link";
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
				<Link href={`/product/${line?.variant.product.slug}`}>
					<div className="flex justify-center items-center h-[74px] w-[74px]  bg-neutral-100 ">
						<Image
							className="aspect-square rounded-md object-cover"
							src={line?.variant?.product?.thumbnail?.url}
							width={80}
							height={80}
							alt=""
						/>
					</div>
				</Link>
			) : (
				<div className="flex justify-center items-center h-[74px] w-[74px] " />
			)}
			<div>
				<Link href={`/product/${line?.variant.product.slug}`}>
					<h3 className="-mt-1 font-bold leading-tight text-[18px] mb-[5px]">
						{line?.variant?.product?.name || ""}
					</h3>
				</Link>
				<p className="text-[16px] mb-[5px]">{line?.variant?.name || ""}</p>
				{line && <QuantityChanges onMinus={onMinus} onPlus={onPlus} line={line} />}
			</div>
			<div className="absolute right-[10px] w-[15px] h-[15px] overflow-hidden flex justify-center items-center top-[20px]">
				<DeleteButton onClick={onDelete} />{" "}
			</div>
			<p className="absolute bottom-[30px]  right-[10px] text-[rgb(189,9,27)]  text-[20px] font-bold leading-none">
				{line.totalPrice?.gross?.amount &&
					line.totalPrice?.gross?.currency &&
					formatMoney(line.totalPrice?.gross?.amount, line.totalPrice?.gross?.currency)}
			</p>
			{loading && <Loading />}
		</li>
	);
};
export default Cart;
