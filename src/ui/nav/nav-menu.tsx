import { GetNavigationDocument, GetNavigationLocalizedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { mapLocaleToLanguageCode } from "@/lib/mapLocaleToLanguageCode";
import RadixAccordion from "@/ui/nav/RadixAccordion";
import RadixAccordionMobile from "@/ui/nav/RadixAccordionMobile";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";
import { cookies } from "next/headers";

// Define types based on fragments
interface MenuItemTranslation {
	name?: string | null;
}

interface CategorySlug {
	slug: string;
}

interface CollectionSlug {
	slug: string;
}

interface PageSlug {
	slug: string;
}

interface MenuItem {
	id: string;
	name: string;
	url?: string | null;
	category?: CategorySlug | null;
	collection?: CollectionSlug | null;
	page?: PageSlug | null;
	translation?: MenuItemTranslation | null;
	children?: MenuItem[] | null;
}

interface ProcessedMenuItem {
	id: string;
	name: string;
	url?: string | null;
	category?: CategorySlug | null;
	collection?: CollectionSlug | null;
	page?: PageSlug | null;
	children: ProcessedMenuItem[];
}

// Process menu items to use translated names if available
function processItems(items: MenuItem[] = [], locale: string): ProcessedMenuItem[] {
	const url = "https://forzafashion.shop";
	return items.map((item) => ({
		...item,
		url: item.url === "https://forzafashion.shop" ? `${url}/${locale === "pl" ? "pl" : ""}` : item.url,
		// Use translated name if available, otherwise fall back to original
		name: item.translation?.name || item.name,
		// Recursively process children
		children: item.children ? processItems(item.children, locale) : [],
	}));
}

interface NavMenuProps {
	params: Promise<{ locale: string }>;
}

export const NavMenu = async ({ params }: NavMenuProps) => {
	const { locale } = await params;
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";
	const languageCode = mapLocaleToLanguageCode(locale);
	let navLinks;

	if (languageCode) {
		// If we have a valid language code, use the localized query
		navLinks = await executeGraphQL(GetNavigationLocalizedDocument, {
			variables: {
				slug: "navbar",
				channel,
				languageCode,
			},
			revalidate: 60 * 5,
		});
	} else {
		// Otherwise, use the non-localized query
		navLinks = await executeGraphQL(GetNavigationDocument, {
			variables: {
				slug: "navbar",
				channel,
			},
			revalidate: 60 * 5,
		});
	}
	console.log(navLinks);

	const processedItems = processItems(navLinks?.menu?.items as MenuItem[], locale);

	return (
		<>
			<div className="sm:block hidden">
				<ul className="flex flex-row items-center justify-center gap-x-1">
					<RadixAccordion items={processedItems} />
				</ul>
			</div>
			<div className="sm:hidden flex items-center min-h-full">
				<NavMobileMenu className="">
					<ul className="h-full flex pb-8 font-normal flex-col items-stretch justify-start gap-x-1 pt-3">
						<RadixAccordionMobile items={processedItems || []} />
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
