"use client";

import { env } from "@/env.mjs";
import { invariant } from "@/lib/invariant";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementLocale, type StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { convertToSubcurrency } from "@/lib/convertToSubcurrency";

async function fetchClientSecret(amount: number): Promise<string | undefined> {
	const response = await fetch(`${env.NEXT_PUBLIC_URL}/api/create-payment-intent`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
	});

	// Парсимо відповідь і типізуємо її як { clientSecret?: string }
	const data = (await response.json().catch(() => ({ clientSecret: undefined }))) as {
		clientSecret?: string;
	};

	// Перевірка, чи містить відповідь необхідну властивість
	if (data.clientSecret && typeof data.clientSecret === "string") {
		return data.clientSecret;
	} else {
		return undefined;
	}
}
export const StripeElementsContainer = ({
	children,
	stripeAccount,
	locale: currentLocale,
}: {
	children: ReactNode;
	stripeAccount?: string;
	locale: string;
}) => {
	const { checkout: cart } = useCheckoutStore((store) => store);
	const [clientSecret, setClientSecret] = useState("");
	useEffect(() => {
		// Огорніть асинхронну функцію у звичайну функцію
		const getClientSecret = async () => {
			if (cart?.totalPrice?.gross?.amount) {
				const getSecret = await fetchClientSecret(cart?.totalPrice?.gross?.amount || 0);
				if (getSecret) {
					setClientSecret(getSecret);
				}
			}
		};
		getClientSecret();
	}, [cart]);
	useEffect(() => {
		console.log(clientSecret, "clieent secret");
	}, [clientSecret]);
	const stripePublishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

	invariant(stripePublishableKey, "Stripe publishable key is required");
	const stripePromise = useMemo(
		() => loadStripe(stripePublishableKey, { stripeAccount }),
		[stripePublishableKey],
	);

	if (!clientSecret) {
		return null;
	}
	const locale = supportedStripeLocales.includes(currentLocale) ? currentLocale : ("auto" as const);
	const options = {
		clientSecret,
		appearance: {
			variables: {
				fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
				fontSizeSm: "0.875rem",
				colorDanger: "hsl(0 84.2% 60.2%)",
			},
		},
		locale,
	} satisfies StripeElementsOptions;

	return (
		<>
			<Elements stripe={stripePromise} options={options}>
				{children}
			</Elements>
		</>
	);
};

// This was taken from `StripeElementLocale` in `@stripe/react-stripe-js`:
const supportedStripeLocales = [
	"ar",
	"bg",
	"cs",
	"da",
	"de",
	"el",
	"en",
	"en-AU",
	"en-CA",
	"en-NZ",
	"en-GB",
	"es",
	"es-ES",
	"es-419",
	"et",
	"fi",
	"fil",
	"fr",
	"fr-CA",
	"fr-FR",
	"he",
	"hu",
	"hr",
	"id",
	"it",
	"it-IT",
	"ja",
	"ko",
	"lt",
	"lv",
	"ms",
	"mt",
	"nb",
	"nl",
	"no",
	"pl",
	"pt",
	"pt-BR",
	"ro",
	"ru",
	"sk",
	"sl",
	"sv",
	"th",
	"tr",
	"vi",
	"zh",
	"zh-HK",
	"zh-TW",
] satisfies StripeElementLocale[];
