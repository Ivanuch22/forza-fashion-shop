import "@/app/globals.css";
import { env, publicUrl } from "@/env.mjs";
import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";
import { Toaster } from "@/ui/shadcn/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Script from "next/script";

import { Poppins } from "next/font/google";
import Head from "next/head";

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className={` ${poppins.className} h-full antialiased`}>
			<Head>
				<meta name="google-site-verification" content="0nsgwsfXdenrRVAOIZ-s7FrOFGX3OXN_f0IKH4hPJ6I" />
			</Head>
			<body className="text-[1.5rem] tracking-[calc(1 + 0.8 / 1.0)] flex min-h-full flex-col">
				<IntlClientProvider messages={messages} locale={locale}>
					<div className="flex min-h-full flex-1 flex-col bg-white" vaul-drawer-wrapper="">
						{children}
					</div>
					<Toaster position="top-center" offset={10} />
				</IntlClientProvider>
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
	);
}
