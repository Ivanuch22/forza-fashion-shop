"use client";
import { convertToSubcurrency } from "@/app/(store)/testing-stripe/lib/convertToSubcurrency";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { type FormEvent, useEffect, useState } from "react";

export default function CheckoutPage({ amount }: { amount: number }) {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState<string>();
	const [clientSecret, setClientSecret] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (!stripe || !elements) return;
		const { error: subimtError } = await elements?.submit();
		if (subimtError) {
			setErrorMessage(subimtError.message);
			setLoading(false);
			return;
		}
		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `http://localhost:3000/payment-success?amount=${amount} `,
			},
		});
	};

	useEffect(() => {
		fetch("/api/create-payment-intent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, [amount]);

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<h1>Checkout Page</h1>
			<p>About {amount}</p>
			{clientSecret && <PaymentElement />}
			{errorMessage && <div>{errorMessage}</div>}
			<button>Pay</button>
		</form>
	);
}
