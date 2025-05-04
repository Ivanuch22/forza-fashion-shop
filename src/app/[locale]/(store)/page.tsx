import image from "@/assets/mainPageImage.jpeg";
import { publicUrl } from "@/env.mjs";
import { ProductListDocument } from "@/gql/graphql";
import { locales } from "@/i18n";
import { executeGraphQL } from "@/lib/graphql";
import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next/types";

export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;

const WhyChooseUs = dynamic(() => import("@/components/why-choose-us"), {
	loading: () => <p>Loading...</p>,
});
const MainProductList = dynamic(() => import("@/components/mainProductList/mainProductList"), {
	loading: () => <p>Loading...</p>,
});
export async function generateStaticParams() {
	return locales.map((locale) => ({
		locale,
	}));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const locale = (await params).locale || "en";
	const cookie = await cookies();
	const getChanel = cookie.get("channel")?.value || "default-channel";
	const [t, getProducts] = await Promise.all([
		getTranslations("/"),
		executeGraphQL(ProductListDocument, {
			variables: { first: 8, channel: getChanel },
			cache: "force-cache",
			revalidate: 60,
		}),
	]);
	if (!getProducts.products) throw Error("No products found");
	setRequestLocale(locale);
	const products = getProducts.products.edges.map(({ node: product }) => product);
	return (
		<main>
			<section className=" relative rounded bg-neutral-100   after:bg-black after:content-[''] after:absolute after:opacity-[0.5] after:z-5 after:w-full after:h-full after:top-0">
				<div className="py-[20%] sm:py-[20%]  mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-1">
					<div className="relative z-[5] text-center text-white flex flex-col justify-center max-w-[29.5rem] ">
						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{t("hero.title")}</h2>
						<p className="text-white text-[1rem] mt-[1rem] text-pretty">{t("hero.description")}</p>
					</div>
					<div className="h-full absolute left-[0] top-[0] w-full block bg-[rgba(5,5,5,_.1)] overflow-hidden">
						<Image
							alt="Cup of Coffee"
							loading="eager"
							className="block max-w-full absolute top-[0] left-[0] h-full w-full"
							height={450}
							width={450}
							src={image}
							style={{ objectFit: "cover" }}
							sizes="(max-width: 640px) 100vw, 450px"
						/>
					</div>
				</div>
			</section>
			<div className="sm:px-6 lg:px-8 m-[0_auto] lg:max-w-[1500px] lg:w-auto">
				<MainProductList products={products} />
				<WhyChooseUs />
			</div>
		</main>
	);
}
