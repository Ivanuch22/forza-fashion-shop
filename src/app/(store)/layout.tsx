import "@/app/globals.css";
import { Footer } from "@/ui/footer/footer";
import { Nav } from "@/ui/nav/nav";
import { TooltipProvider } from "@/ui/shadcn/tooltip";
import { CheckoutStoreProvider } from "@/zustand/providers/checkout-store-provider";

export default async function StoreLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
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
