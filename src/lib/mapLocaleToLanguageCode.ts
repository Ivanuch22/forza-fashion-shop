import { LanguageCodeEnum } from "@/gql/graphql";

// Map Next.js locale to Saleor LanguageCodeEnum
export function mapLocaleToLanguageCode(locale: string): LanguageCodeEnum {
	const localeMap: Record<string, LanguageCodeEnum> = {
		en: LanguageCodeEnum.En,
		pl: LanguageCodeEnum.PlPl,
	};

	return localeMap[locale] || LanguageCodeEnum.En; // Default to English
}
