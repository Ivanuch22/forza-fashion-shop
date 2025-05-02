import CartDetails from "@/app/[locale]/(store)/cart/components/cart-details";
import { CART_COOKIE } from "@/lib/cart";
import { CartEmpty } from "@/ui/checkout/cart-empty";
import { StripeElementsContainer } from "@/ui/checkout/stripe-elements-container";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

export default async function CartLayout({
	children,
	params,
}: { children: ReactNode; params: Promise<{ locale: string }> }) {
	const locale = (await params).locale || "en";
	const cookie = await cookies();
	let checkoutId = cookie.get(CART_COOKIE)?.value || "";
	if (!checkoutId) {
		return <CartEmpty />;
	}
	return (
		<StripeElementsContainer stripeAccount={undefined} locale={locale}>
			<div className="min-h-[calc(100dvh-7rem)] grid lg:grid lg:grid-cols-12 lg:border-t-[1px] border-[hsl(0,0%,87%)] border-solid ">
				<div className="lg:my-8 my-4 max-w-[65ch] lg:col-span-6 px-4 lg:px-8 ">{children}</div>
				<CartDetails locale={locale} />
			</div>
		</StripeElementsContainer>
	);
}
