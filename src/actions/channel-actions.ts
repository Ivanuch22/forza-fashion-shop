"use server";

import { CART_COOKIE } from "@/lib/cart";
import { cookies } from "next/headers";

const shouldUseHttps =
	process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;

export async function updateCurrency(chanel: string, currency: string) {
	if (!chanel || !currency) {
		return null;
	}

	const cookie = await cookies();
	cookie.set("channel", chanel, {
		secure: shouldUseHttps,
		sameSite: "lax",
		httpOnly: true,
	});
	cookie.set("currency", currency, {
		secure: shouldUseHttps,
		sameSite: "lax",
		httpOnly: true,
	});
	cookie.set(CART_COOKIE, "");
	return true;
}
