"use client";
import { CartModalAddSideEffect } from "@/app/[locale]/(store)/@modal/(.)cart-overlay/cart-side-effect";
import Cart from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/cart";
import ExitButton from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/exit-button";
import Loading from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/loading";
import type { CheckoutLine } from "@/gql/graphql";
import { formatMoney } from "@/lib/graphql";
import { Button } from "@/ui/shadcn/button";
import { YnsLink } from "@/ui/yns-link";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";

const MemoizedCart = memo(Cart);

const ClientBlock = ({
	checkoutID,
	searchParams,
}: {
	searchParams: { add?: string };
	checkoutID: string;
}) => {
	const t = useTranslations("cart");
	const [loading, setLoading] = useState(false);

	const checkout = useCheckoutStore((state) => state.checkout);

	const currency = useMemo(
		() => checkout?.totalPrice?.gross?.currency || "USD",
		[checkout?.totalPrice?.gross?.currency],
	);

	const count = useMemo(
		() => checkout?.lines?.reduce((acc, el) => +acc + +el.quantity, 0) || 0,
		[checkout?.lines],
	);

	const totalAmount = useMemo(
		() => checkout?.totalPrice?.gross?.amount || 0,
		[checkout?.totalPrice?.gross?.amount],
	);

	const formattedTotal = useMemo(() => formatMoney(totalAmount, currency), [totalAmount, currency]);

	if (count === 0) {
		return (
			<div
				key={"cart-modal-client-empty-block"}
				className="min-w-full flex flex-col min-h-[100vh] justify-center items-center overflow-y-auto px-2 py-4 sm:px-4"
			>
				<h3 className="font-bold text-[28px] mb-[10px]">{t("empty.title")}</h3>
				<YnsLink
					href="/category"
					className="text-[1.5rem] font-bold mx-w-[220px] block overflow-hidden m-[0_auto] p-[.5rem_2rem] text-white rounded-[5px] border-0 bg-[rgba(173,0,0,.9)]"
				>
					{t("empty.continueShoppingButton")}
				</YnsLink>
			</div>
		);
	}

	return (
		<>
			<div className="px-2 py-4 sm:px-4">
				<div className="flex relative items-center justify-between">
					<h2 className="text-[25px] lg:text-[33px] font-bold text-neutral-700">{t("modal.title")}</h2>
					<ExitButton />
				</div>
			</div>
			<div className="flex-1 overflow-y-auto">
				<ul role="list" className="px-2 divide-y divide-neutral-200">
					{checkout?.lines?.map((line) => (
						<MemoizedCart key={line.id} line={line as CheckoutLine} checkoutId={checkoutID} />
					))}
				</ul>
			</div>
			<div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
				<div
					id="cart-overlay-description"
					className="flex justify-between text-base font-medium text-neutral-900"
				>
					<p>{t("modal.total")}</p>
					<p>{formattedTotal}</p>
				</div>
				<p className="mt-0.5 text-sm text-neutral-500">{t("modal.shippingAndTaxesInfo")}</p>
				<Button asChild={true} size="lg" className="mt-6 w-full rounded-[5px] text-lg">
					<YnsLink className="font-bold block" onClick={() => setLoading(true)} href="/cart-v2">
						{loading ? <Loading /> : t("modal.goToPaymentButton", { sum: formattedTotal })}
					</YnsLink>
				</Button>
			</div>
			{searchParams.add && <CartModalAddSideEffect productId={searchParams?.add} />}
		</>
	);
};

export default ClientBlock;
