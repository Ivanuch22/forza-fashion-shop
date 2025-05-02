"use client";
import Loading from "@/app/[locale]/(store)/@modal/(.)cart-overlay/components/loading";
import {
	type AddressTypeEnum,
	CheckoutAddPromoCodeDocument,
	type CheckoutErrorCode,
	type CheckoutFindQuery,
	CheckoutRemovePromoCodeDocument,
} from "@/gql/graphql";
import { executeGraphQL, formatMoney } from "@/lib/graphql";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { FormEvent } from "react";

interface IErrorType {
	__typename?: "CheckoutError" | undefined;
	addressType?: AddressTypeEnum | null | undefined;
	code: CheckoutErrorCode | undefined;
	field?: string | null | undefined;
	variants?: string[] | undefined;
	message?: string | undefined;
	lines?: string[] | undefined;
}

const PromoTag = ({ code, checkoutId }: { checkoutId: string; code: string }) => {
	const { changeCheckout } = useCheckoutStore((store) => store);
	const [errors, setErrors] = useState<IErrorType[]>([]);
	const onSubmit = async () => {
		const { checkoutRemovePromoCode } = await executeGraphQL(CheckoutRemovePromoCodeDocument, {
			variables: {
				id: checkoutId,
				promoCode: code,
			},
		});
		if ((checkoutRemovePromoCode?.errors?.length || 0) > 0) {
			setErrors(checkoutRemovePromoCode?.errors as IErrorType[]);
		} else {
			setErrors([]);
		}
		if (checkoutRemovePromoCode?.checkout !== null) {
			changeCheckout(checkoutRemovePromoCode?.checkout);
		}
	};
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<div className="inline-flex items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-gray-700 text-xs ">
				<span className="flex items-center gap-2">
					<span className="text-sm w-[18px] h-[18px] ">
						<svg
							className="w-full h-full stroke-current "
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 14 14"
							focusable="false"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								d="M7.284 1.402h4.964a.35.35 0 0 1 .35.35v4.964a.7.7 0 0 1-.205.495L7.49 12.115a.7.7 0 0 1-.99 0L1.885 7.5a.7.7 0 0 1 0-.99L6.79 1.607a.7.7 0 0 1 .495-.205Z"
							></path>
							<circle cx="9.1" cy="4.9" r="0.7"></circle>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9.102 4.897h-.005v.005h.005z"></path>
						</svg>
					</span>
					<span className="tracking-wider">{code}</span>
				</span>
				<button
					className={`ml-2 p-1 transition-all  rounded-md hover:bg-gray-300 ${isHovered ? "text-gray-900" : "text-gray-500"}`}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					onClick={() => onSubmit()}
				>
					✕
				</button>
			</div>
			{errors?.length > 0 && (
				<div>
					{errors.map((error) => (
						<p key={`${error?.message}+${error?.code}`} className="text-[14px] text-red-600 py-1">
							{error?.message}
						</p>
					))}
				</div>
			)}
		</>
	);
};

export const CheckoutSummary = ({ cart }: { cart: CheckoutFindQuery["checkout"] }) => {
	const [promoCode, setPromocode] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<IErrorType[]>([]);
	const { changeCheckout } = useCheckoutStore((store) => store);
	const t = useTranslations("cart");
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		const { checkoutAddPromoCode } = await executeGraphQL(CheckoutAddPromoCodeDocument, {
			variables: {
				promoCode: promoCode,
				checkoutId: cart?.id,
			},
		});
		setPromocode("");
		setLoading(false);
		if ((checkoutAddPromoCode?.errors?.length || 0) > 0) {
			setErrors(checkoutAddPromoCode?.errors as IErrorType[]);
		}
		if (checkoutAddPromoCode?.checkout !== null) {
			changeCheckout(checkoutAddPromoCode?.checkout);
		}
	};

	return (
		<div className="p-1">
			<form onSubmit={(e) => handleSubmit(e)} className="flex items-center gap-4 ">
				<input
					onChange={(e) => setPromocode(e.target.value)}
					value={promoCode}
					type="text"
					placeholder={t("page.summaryTable.discountPlayceholder")}
					className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none  "
				/>
				<button
					type="submit"
					disabled={promoCode.length < 3}
					className="disabled:cursor-not-allowed bg-black text-white disabled:bg-gray-200 text-sm font-medium disabled:text-black px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none  "
				>
					{loading ? <Loading /> : t("page.summaryTable.applyButton")}
				</button>
			</form>
			{cart?.voucherCode && <PromoTag checkoutId={cart.id} code={cart?.voucherCode || ""} />}
			{errors?.length > 0 && (
				<div>
					{errors.map((error) => (
						<p key={`${error?.message}+${error?.code}`} className="text-[14px] text-red-600 py-1">
							{error?.message}
						</p>
					))}
				</div>
			)}
			<div className="mt-6 flex justify-between items-center text-sm text-black mb-2">
				<span>
					{t("page.summaryTable.subtotal", {
						count: cart?.lines.reduce((acc, line) => acc + line?.quantity, 0) ?? 0,
					})}{" "}
				</span>
				<span>
					{formatMoney(cart?.totalPrice?.gross?.amount || 0, cart?.totalPrice?.gross?.currency || "")}
				</span>
			</div>
			<div className="flex justify-between items-center text-sm text-black mb-2">
				<span className="flex items-center gap-1">{t("page.summaryTable.shipping")}</span>
				<span>{formatMoney(0, cart?.totalPrice.gross.currency || "")}</span>
			</div>
			<div className="flex justify-between items-end font-semibold text-lg text-gray-900 mt-4">
				<span>{t("page.summaryTable.totalCol")}</span>
				<div className="text-right flex items-end font-semibold gap-2 ">
					<span>
						{formatMoney(cart?.totalPrice.gross.amount || 0, cart?.totalPrice.gross.currency || "")}
					</span>
				</div>
			</div>
			{cart?.discount?.amount != 0 && cart?.discount?.amount && (
				<div className="text-sm font-semibold mt-2 flex items-center justify-start gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 18 18"
						focusable="false"
						aria-hidden="true"
						className="w-[18px] h-[18px] block a8x1wu10 a8x1wuz _1fragem1y _1fragemod _1fragemkk _1fragemka _1fragemnm"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m10.802 15.686 5.367-5.368a.15.15 0 0 0 .046-.109V4.144m-2.998-.95h-5.67a.16.16 0 0 0-.11.046L1.779 8.897a.154.154 0 0 0 0 .219l5.594 5.593c.06.06.158.06.218 0l5.658-5.657a.15.15 0 0 0 .045-.11v-5.67a.077.077 0 0 0-.077-.077Zm-3.06 3.749a.643.643 0 1 1-1.286 0 .643.643 0 0 1 1.286 0m-.648-.005h.01v.01h-.01z"
						></path>
					</svg>
					{t("page.summaryTable.totalSavings", {
						number: formatMoney(cart?.discount?.amount || 0, cart?.discount?.currency || ""),
					})}
				</div>
			)}
		</div>
	);
};
