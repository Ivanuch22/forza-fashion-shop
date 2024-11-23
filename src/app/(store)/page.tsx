// @ts-nocheck
import image from "@/assets/mainPageImage.webp";
import MainProductList from "@/components/mainProductList/mainProductList";
import { publicUrl } from "@/env.mjs";
import {
	CollectionListDocument,
	GetApparelChildrenDocument,
} from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import CollectionEmblaCarousel from "@/modules/mainPage/components/category-embla-arousel";
import type { EmblaOptionsType } from "embla-carousel";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Metadata } from "next/types";
import { Suspense } from "react";

export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;

const WhyChooseUs = dynamic(() => import('@/components/why-choose-us'), {
	loading: () => <p>Loading...</p>,
})


export default async function Home() {
	const [getCategory, { collections }, t] = await Promise.all([
		executeGraphQL(GetApparelChildrenDocument, {
			variables: { first1: 10 },
			revalidate: 60, // ISR (оновлення кожні 60 секунд)
			cache: 'force-cache' // використання кешу для збереження результатів
		}),
		executeGraphQL(CollectionListDocument, {
			variables: { first1: 10 },
			revalidate: 60, // ISR
			cache: 'force-cache' // кешування
		}),
		getTranslations("/")
	]);

	const OPTIONS: EmblaOptionsType = { dragFree: false };
	const categorySlides = getCategory.category?.children?.edges || [];
	const collectionSlides = collections?.edges || [];

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
							loading="lazy" // Використовуйте лише "eager", якщо це критично для дизайну
							className="block max-w-full absolute top-[0] left-[0] h-full w-full"
							height={450}
							width={450}
							src={image}
							style={{ objectFit: "cover" }}
							sizes="(max-width: 640px) 100vw, 450px" // Оптимізує розміри зображення під пристрої
						/>
					</div>
				</div>
			</section>
			<div className="sm:px-6 lg:px-8 m-[0_auto] lg:max-w-[1500px] lg:w-auto">
				<section className="w-full py-8">
					<h4 className="text-[rgba(5,5,5,0.9)] font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] tracking-[0.06em] mb-6 mx-0 my-12 px-6 mt-6">
						Collections
					</h4>
					{collectionSlides.length > 0 && (
						<CollectionEmblaCarousel type="collection" slides={collectionSlides} options={OPTIONS} />
					)}
				</section>
				<section className="w-full py-8 ">
					<h4 className="text-[rgba(5,5,5,0.9)] font-bold  flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] tracking-[0.06em] mb-6 mx-0 my-12 px-6 mt-6">
						Apparel
					</h4>
					{categorySlides.length > 0 && <CollectionEmblaCarousel type="category" slides={categorySlides} options={OPTIONS} />}
				</section>
				<section className="md:max-w-[560px] lg:max-w-[780px] m-[0_auto] w-full py-8 text-[rgb(5,5,5)]">
					<h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">

						Inspired Living from Dusk to Dawn</h5>
					<p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className="px-5 tracking-[0.02rem] text-[1rem] text-center">
						At Ridge & Dawn, we believe that life’s journey is defined by the small details. From home decor that inspires to apparel and footwear that empowers, and tech accessories that simplify your everyday, our curated collections are designed to elevate your lifestyle.</p>
				</section>
				<Suspense>
					<MainProductList />
				</Suspense>
				<WhyChooseUs />
			</div>
		</main>
	);
}
