import { CartSummaryNav } from "@/ui/nav/cart-summary-nav";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async ({ params }: { params: Promise<{ locale: string }> }) => {
	return (
		<header className="z-50 py-4 sm:sticky top-0 bg-white/90 backdrop-blur-sm nav-border-reveal">
			<div className="mx-auto flex  items-center gap-2 px-4 flex-row sm:px-6 lg:px-8">
				<div className="max-w-full flex h-full  w-auto  overflow-auto max-sm:order-2">
					<NavMenu params={params} />
				</div>
				<YnsLink href="/" className="flex-shrink sm:m-auto max-w-full flex">
					<SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">Forza Fashion</SeoH1>
				</YnsLink>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<CartSummaryNav />
			</div>
		</header>
	);
};
