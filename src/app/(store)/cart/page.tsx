import { getTranslations } from "@/i18n/server";
import * as Checkout from "@/lib/checkout";
import { CheckoutCard } from "@/ui/checkout/checkout-card";
import { cookies } from "next/headers";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/cart.metadata");
	return {
		title: t("title"),
	};
};

export default async function CartPage() {
	const cookie = await cookies();
	let checkoutId = cookie.get("checkoutId")?.value || "";
	const cart = await Checkout.find(checkoutId || "");
	if (!cart) {
		return null;
	}

	return <CheckoutCard cart={cart} />;
}
