import { env } from "@/env.mjs";
import { type NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
	try {
		const { amount } = await request.json();
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			automatic_payment_methods: { enabled: true }, // Виправлено тут
		});
		return NextResponse.json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: `internal server error: ${error}` }, { status: 500 });
	}
}
