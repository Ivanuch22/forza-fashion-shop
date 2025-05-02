"use client";

import CheckoutPage from "@/app/[locale]/(store)/testing-stripe/components/CheckoutPage";
import { env } from "@/env.mjs";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function ViewStripe({ currency }: { currency: string }) {
	const amount = 38.88;

	return (
		<>
			<Elements
				stripe={stripePromise}
				options={{
					mode: "payment",
					amount: convertToSubcurrency(amount),
					currency: currency,
				}}
			>
				<CheckoutPage amount={amount} />
			</Elements>
		</>
	);
}
