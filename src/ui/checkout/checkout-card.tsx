import { getLocale, getTranslations } from "@/i18n/server";
import { StripePayment } from "@/ui/checkout/stripe-payment";
import mastercard from "@/images/payments/mastercard.svg";
import google_pay from "@/images/payments/google_pay.svg";
import visa from "@/images/payments/visa.svg";
// import amex from "@/images/payments/amex.svg";
// import blik from "@/images/payments/blik.svg";
// import klarna from "@/images/payments/klarna.svg";
// import link from "@/images/payments/link.svg";
// import p24 from "@/images/payments/p24.svg";

export const paymentMethods = {
	mastercard,
	visa,
	google_pay,
	// amex,
	// blik,
	// klarna,
	// link,
	// p24,
};

export const CheckoutCard = async () => {
	const t = await getTranslations("/cart.page");
	const locale = await getLocale();

	return (
		<section className="max-w-lg pb-12 lg:ml-auto lg:m-auto m-[0_auto] lg:block">
			<h2 className="text-3xl font-bold leading-none tracking-tight">{t("checkoutTitle")}</h2>
			<p className="mb-4 mt-2 text-sm text-muted-foreground">{t("checkoutDescription")}</p>
			<StripePayment shippingRateId={null} shippingRates={[]} allProductsDigital={false} locale={locale} />
		</section>
	);
};
