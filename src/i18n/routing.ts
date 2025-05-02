import { defaultLocale, localePrefix, locales } from "@/i18n";
import { createNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
	locales,
	defaultLocale,
	localePrefix,
	localeDetection: false,
});
