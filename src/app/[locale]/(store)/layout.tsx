import "@/app/globals.css";
import { env, publicUrl } from "@/env.mjs";
import { Footer } from "@/ui/footer/footer";
import { Nav } from "@/ui/nav/nav";
import { Toaster } from "@/ui/shadcn/sonner";
import { TooltipProvider } from "@/ui/shadcn/tooltip";
import { CheckoutStoreProvider } from "@/zustand/providers/checkout-store-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import Script from "next/script";

const poppins = Poppins({
	weight: ["400", "700", "600", "500"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
});

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("Global.metadata");
	return {
		title: t("title"),
		description: t("description"),
		metadataBase: new URL(publicUrl),
		verification: {
			google: "0nsgwsfXdenrRVAOIZ-s7FrOFGX3OXN_f0IKH4hPJ6I", // Додає <meta name="google-site-verification">
		},
	};
};

export default async function StoreLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	const messages = await getMessages();

	return (
		<>
			<html lang={"en"} className={` ${poppins.className} h-full antialiased`}>
				<body className="text-[1.5rem] tracking-[calc(1 + 0.8 / 1.0)] flex min-h-full flex-col">
					<NextIntlClientProvider messages={messages}>
						<div className="flex min-h-full flex-1 flex-col bg-white" vaul-drawer-wrapper="">
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
						</div>
					</NextIntlClientProvider>
					<Toaster position="top-center" offset={10} />
					{env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
						<Script
							async
							src="/stats/script.js"
							data-host-url={publicUrl + "/stats"}
							data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
						/>
					)}
					<SpeedInsights />
					<Analytics />
				</body>
			</html>
		</>
	);
}
