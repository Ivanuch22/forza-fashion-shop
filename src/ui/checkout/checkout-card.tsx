import google_pay from "@/images/payments/google_pay.svg";
import mastercard from "@/images/payments/mastercard.svg";
import visa from "@/images/payments/visa.svg";
import { StripePayment } from "@/ui/checkout/stripe-payment";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
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
	const locale = await getLocale();
	const cookie = await cookies();
	let channel = cookie.get("channel")?.value || "defaul-channel";

	return (
		<section className="max-w-lg pb-12 lg:ml-auto lg:m-auto m-[0_auto] lg:block">
			<h2 className="text-3xl font-bold leading-none tracking-tight">Chekcout</h2>
			<p className="mb-4 mt-2 text-sm text-muted-foreground">Provide billing and shipping details below.</p>
			<StripePayment
				channel={channel}
				shippingRateId={null}
				shippingRates={[]}
				allProductsDigital={false}
				locale={locale}
			/>
		</section>
	);
};
