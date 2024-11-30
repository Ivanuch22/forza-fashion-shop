import "@/app/globals.css";
import { CART_COOKIE } from "@/lib/cart";
import { Footer } from "@/ui/footer/footer";
import { Nav } from "@/ui/nav/nav";
import { TooltipProvider } from "@/ui/shadcn/tooltip";
import { CheckoutStoreProvider } from "@/zustand/providers/checkout-store-provider";
import { cookies } from "next/headers";

export default async function StoreLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	const cookie = await cookies();
	const getChanel = cookie.get(CART_COOKIE)?.value || "chekcout id";
	console.log(getChanel, "chekcout id");
	return (
		<>
			{/* <Banner /> */}
			<CheckoutStoreProvider>
				<Nav />
				<TooltipProvider>
					<main className="mx-auto flex w-full flex-1 flex-col overflow-x-hidden">
						{children}
						{modal}
					</main>
					<Footer />
				</TooltipProvider>
			</CheckoutStoreProvider>
			{/* <JsonLd
				jsonLd={accountToWebsiteJsonLd({
					account: accountResult?.account,
					logoUrl: logoLink?.url,
				})}/> */}
		</>
	);
}
