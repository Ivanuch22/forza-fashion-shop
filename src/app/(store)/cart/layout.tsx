import { getLocale, getTranslations } from "@/i18n/server";
import type { ReactNode } from "react";

import { convertToSubcurrency } from "@/app/(store)/testing-stripe/lib/convertToSubcurrency";
import { env } from "@/env.mjs";
import * as Checkout from "@/lib/checkout";
import { CartEmpty } from "@/ui/checkout/cart-empty";
import { CartSummaryTable } from "@/ui/checkout/cart-summary-table";
import { StripeElementsContainer } from "@/ui/checkout/stripe-elements-container";
import { cookies } from "next/headers";

async function fetchClientSicret(amount: number) {
	let secret = fetch(`${env.NEXT_PUBLIC_URL}/api/create-payment-intent`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
	})
		.then((res) => res.json())
		.then((data) => data?.clientSecret);
	return secret;
}

export default async function CartLayout({ children }: { children: ReactNode }) {
	const cookie = await cookies();
	let checkoutId = cookie.get("checkoutId")?.value || "";
	const cart = await Checkout.find(checkoutId);

	if (!cart || cart.lines.length === 0) {
		return <CartEmpty />;
	}
	// const { stripeAccount, publishableKey } = await Commerce.contextGet();
	const clientSecret = await fetchClientSicret(cart.totalPrice.gross.amount);
	const t = await getTranslations("/cart.page");
	const locale = await getLocale();

	return (
		<StripeElementsContainer
			clientSecret={clientSecret}
			publishableKey={undefined}
			stripeAccount={undefined}
			locale={locale}
			cart={cart}
		>
			<div className="min-h-[calc(100dvh-7rem)] xl:grid xl:grid-cols-12 xl:gap-x-8">
				<div className="my-8 xl:col-span-7">
					<div className="sticky top-1">
						<h1 className="mb-4 text-3xl font-bold leading-none tracking-tight">{t("title")}</h1>
						<CartSummaryTable cart={cart} locale={locale} />
					</div>
				</div>
				<div className="my-8 max-w-[65ch] xl:col-span-5">{children}</div>
			</div>
		</StripeElementsContainer>
	);
}
