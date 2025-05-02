import { CART_COOKIE } from "@/lib/cart";
import PayUPayments from "@/ui/checkout/payu-payments";
import { getLocale, getTranslations } from "next-intl/server";
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
	if (!checkoutId) return null;
	const locale = await getLocale();
	let channel = cookie.get("channel")?.value || "defaul-channel";
	const t = await getTranslations("cart");

	return (
		<section className="max-w-lg pb-12 lg:ml-auto lg:m-auto m-[0_auto] lg:block">
			<h2 className="text-3xl font-bold leading-none tracking-tight">{t("page.checkoutTitle")}</h2>
			<p className="mb-4 mt-2 text-sm text-muted-foreground">{t("page.checkoutDescription")}</p>
			<PayUPayments channel={channel} locale={locale} />
		</section>
	);
}
