"use client";

import CheckoutPage from "@/app/(store)/testing-stripe/components/CheckoutPage";
import { convertToSubcurrency } from "@/app/(store)/testing-stripe/lib/convertToSubcurrency";
import { env } from "@/env.mjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function ViewStripe() {
	const amount = 38.88;

	return (
		<>
			<Elements
				stripe={stripePromise}
				options={{
					mode: "payment",
					amount: convertToSubcurrency(amount),
					currency: "usd",
				}}
			>
				<CheckoutPage amount={amount} />
			</Elements>
		</>
	);
}
