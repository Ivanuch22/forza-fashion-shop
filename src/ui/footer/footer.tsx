import CurrencyModal from "@/components/currencyModal/currencyModal";
import { channels } from "@/const/channels";
import { GetNavigationDocument, type GetNavigationQuery } from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import { Newsletter } from "@/ui/footer/newsletter.client";
import { YnsLink } from "@/ui/yns-link";
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

export async function Footer() {
	const t = await getTranslations("Global.footer");
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value;

	const navLinks = await executeGraphQL(GetNavigationDocument, {
		variables: { slug: "footer", channel },
		revalidate: 60 * 60 * 24,
	});
	if (!navLinks?.menu?.items) return;
	const data = transformData(navLinks);

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
							<text x="0" y="20" font-size="20" font-family="Arial" fill="#6cbe45">
								PayU
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64">
							<text x="0" y="45" font-size="40" font-family="Arial" fill="#000">
								 Pay
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64">
							<text x="0" y="45" font-size="40" font-family="Arial" fill="#4285F4">
								G
							</text>
							<text x="30" y="45" font-size="40" font-family="Arial" fill="#000">
								Pay
							</text>
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
							<text x="0" y="25" font-size="24" font-family="Arial" fill="#1a1f71">
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
