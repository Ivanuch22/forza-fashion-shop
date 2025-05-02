import { CART_COOKIE } from "@/lib/cart";
import { CheckoutCard } from "@/ui/checkout/checkout-card";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("cart.metadata");
	return {
		title: t("title"),
	};
};

export default async function CartPage() {
	const cookie = await cookies();
	let checkoutId = cookie.get(CART_COOKIE)?.value || "";
	if (!checkoutId) {
		return null;
	}

	return <CheckoutCard />;
}
