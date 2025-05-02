"use client";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { type FormEvent, useEffect, useState } from "react";

export default function CheckoutPage({ amount }: { amount: number }) {
	const stripe = useStripe();
	const elements = useElements();
	const [errorMessage, setErrorMessage] = useState<string>();
	const [clientSecret, setClientSecret] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!stripe || !elements) return;
		const { error: subimtError } = await elements?.submit();
		if (subimtError) {
			setErrorMessage(subimtError.message);
			return;
		}
		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `http://localhost:3000/payment-success?amount=${amount} `,
			},
		});
		console.log(error);
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
			.then((data: unknown) => {
				// Перевіряємо, чи є у data поле clientSecret
				if (typeof data === "object" && data !== null && "clientSecret" in data) {
					const { clientSecret } = data as { clientSecret: string };
					setClientSecret(clientSecret);
				} else {
					console.error("Invalid response data");
				}
			})
			.catch((error) => console.error("Error fetching payment intent:", error));
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
