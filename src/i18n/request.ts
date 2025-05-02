import { defaultLocale, locales } from "@/i18n";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = hasLocale(locales, requested) ? requested : defaultLocale;

	return {
		locale,
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
