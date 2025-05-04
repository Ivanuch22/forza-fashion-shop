import CurrencyModal from "@/components/currencyModal/currencyModal";
import { channels } from "@/const/channels";
import {
	GetNavigationDocument,
	GetNavigationLocalizedDocument,
	type GetNavigationQuery,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { mapLocaleToLanguageCode } from "@/lib/mapLocaleToLanguageCode";
import { Newsletter } from "@/ui/footer/newsletter.client";
import { YnsLink } from "@/ui/yns-link";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

function transformData(data: GetNavigationQuery) {
	if (data?.menu?.items) {
		return data.menu.items.map((item) => {
			const header = item.name;
			const links = item?.children
				? item.children.map((child) => {
						let href = "/"; // дефолтне значення, якщо немає slug чи інших посилань
						if (child.page?.slug) {
							href = `/page/${child.page.slug}`;
						} else if (child.collection?.slug) {
							href = `/collection/${child.collection.slug}`;
						} else if (child.category?.slug) {
							href = `/category/${child.category.slug}`;
						}
						return {
							label: child.name,
							href: href,
						};
					})
				: [];
			return {
				header: header,
				links: links,
			};
		});
	}
}

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
function processItems(items: MenuItem[] = []): ProcessedMenuItem[] {
	return items.map((item) => ({
		...item,
		// Use translated name if available, otherwise fall back to original
		name: item.translation?.name || item.name,
		// Recursively process children
		children: item.children ? processItems(item.children) : [],
	}));
}

export async function Footer({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations("Global.footer");
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value;
	const languageCode = mapLocaleToLanguageCode(locale);

	let navLinks;
	if (languageCode) {
		navLinks = await executeGraphQL(GetNavigationLocalizedDocument, {
			variables: {
				slug: "footer",
				channel,
				languageCode,
			},
			revalidate: 60 * 60 * 24,
		});
	} else {
		navLinks = await executeGraphQL(GetNavigationDocument, {
			variables: {
				slug: "footer",
				channel,
				languageCode,
			},
			revalidate: 60 * 60 * 24,
		});
	}

	if (!navLinks?.menu?.items) return;
	const processedItems = processItems(navLinks?.menu?.items as MenuItem[]);
	const data = transformData({ menu: { items: processedItems } });

	return (
		<footer className="w-full bg-neutral-50 p-6 text-neutral-800 md:py-12">
			<div className=" flex flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
				<div className="">
					<div className="flex w-full max-w-sm flex-col gap-2">
						<h3 className="font-semibold">{t("newsletterTitle")}</h3>
						<Newsletter />
					</div>
				</div>
				<div className="bg:black">
					<CurrencyModal channel={String(channel)} channels={channels} />
				</div>

				<nav className="grid grid-cols-2 gap-16">
					{data?.map((section) => (
						<section key={section.header}>
							<h3 className="mb-2 font-semibold">{section.header}</h3>
							<ul role="list" className="grid gap-1">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink className="underline-offset-4 hover:underline" href={link.href}>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>
			<div className=" mt-8 flex  flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
				<div>
					<p>© 2025 Forza Fashion</p>
					<p>Delightfully commerce for everyone</p>
				</div>
				<div>
					<div className="min-w-[80vw] md:min-w-[30vw] flex justify-center content-center">
						<svg viewBox="0 0 100 25" xmlns="http://www.w3.org/2000/svg">
							<text x="0" y="20" fontSize="20" fontFamily="Arial" fill="#6cbe45">
								PayU
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64">
							<text x="0" y="45" fontSize="40" fontFamily="Arial" fill="#000">
								 Pay
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64">
							<text x="0" y="45" fontSize="40" fontFamily="Arial" fill="#4285F4">
								G
							</text>
							<text x="30" y="45" fontSize="40" fontFamily="Arial" fill="#000">
								Pay
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
							<text x="0" y="25" fontSize="24" fontFamily="Arial" fill="#1a1f71">
								VISA
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
							<circle cx="35" cy="20" r="15" fill="#eb001b" />
							<circle cx="50" cy="20" r="15" fill="#f79e1b" />
						</svg>
					</div>
				</div>
				<div className="flex items-center gap-4">
					Delevop by
					<YnsLink
						className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700"
						href="http://kalynych.com"
					>
						kalynych.com
					</YnsLink>
				</div>
			</div>
		</footer>
	);
}
