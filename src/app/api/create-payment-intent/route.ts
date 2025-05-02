import { env } from "@/env.mjs";
import { type NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

// Оголошуємо тип для тіла запиту
interface PaymentRequestBody {
	amount: number; // amount має бути числом
}

export async function POST(request: NextRequest) {
	try {
		// Парсимо JSON як unknown
		const requestData: unknown = await request.json();
		console.log(requestData);
		const currency = request.cookies.get("currency")?.value || "usd";
		// Перевіряємо, чи є amount в тілі запиту
		if (isValidPaymentRequestBody(requestData)) {
			const { amount } = requestData;

			const paymentIntent = await stripe.paymentIntents.create({
				amount,
				currency,
				automatic_payment_methods: { enabled: true },
			});

			return NextResponse.json({ clientSecret: paymentIntent.client_secret });
		} else {
			return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: `internal server error: ${error}` }, { status: 500 });
	}
}

// Типова перевірка для PaymentRequestBody
function isValidPaymentRequestBody(data: unknown): data is PaymentRequestBody {
	return (
		typeof data === "object" &&
		data !== null &&
		"amount" in data &&
		typeof (data as { amount: unknown }).amount === "number"
	);
}
