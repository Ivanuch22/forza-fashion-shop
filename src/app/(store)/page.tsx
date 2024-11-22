// @ts-nocheck

import image from "@/assets/mainPageImage.webp";
import WhyChooseUs from "@/components/why-choose-us";
import { publicUrl } from "@/env.mjs";
import {
	type CategoryCountableEdge,
	type CollectionCountableEdge,
	CollectionListDocument,
	GetApparelChildrenDocument,
	ProductListDocument,
} from "@/gql/graphql";
import { getTranslations } from "@/i18n/server";
import { executeGraphQL } from "@/lib/graphql";
import CategoryEmblaCarousel from "@/modules/mainPage/components/category-embla-arousel";
import CollectionEmblaCarousel from "@/modules/mainPage/components/collection-embla-arousel";
import { ProductList } from "@/ui/products/product-list";
import type { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import type { Metadata } from "next/types";
export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;


export default async function Home() {
	const [data, getCategory, { collections }] = await Promise.all([
		executeGraphQL(ProductListDocument, { variables: { first: 8 }, revalidate: 60 }),
		executeGraphQL(GetApparelChildrenDocument, { variables: { first1: 10 }, revalidate: 60 }),
		executeGraphQL(CollectionListDocument, { variables: { first1: 10 }, revalidate: 60 }),
	]);

	if (!data.products) throw Error("No products found");

	const products = data.products.edges.map(({ node: product }) => product);
	const t = await getTranslations("/");
	const OPTIONS: EmblaOptionsType = { dragFree: true };
	const categorySlides: CategoryCountableEdge[] = getCategory.category?.children?.edges;

	const collectionSlides: CollectionCountableEdge[] = collections?.edges;
	return (
		<main>
			<section className="[@media(min-width:750px)]:min-h-[72vh] min-h-[40vh] relative rounded bg-neutral-100 py-8 sm:py-12  after:bg-black after:content-[''] after:absolute after:opacity-[0.5] after:z-5 after:w-full after:h-full after:top-0">
				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-1">
					<div className="relative z-[5] text-center text-white flex flex-col justify-center max-w-[29.5rem] pt-[11%]">
						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{t("hero.title")}</h2>
						<p className="text-white text-[1rem] mt-[1rem] text-pretty">{t("hero.description")}</p>
					</div>
					<div className="h-full absolute left-[0] top-[0] w-full block bg-[rgba(5,5,5,_.1)] overflow-hidden">
						<Image
							alt="Cup of Coffee"
							loading="eager"
							priority={true}
							className="block max-w-full absolute top-[0] left-[0] h-full w-full [transition:opacity_.4s_cubic-bezier(.25,.46,.45,.94)] align-bottom"
							height={450}
							width={450}
							src={image}
							style={{ objectFit: "cover" }}
							sizes="(max-width: 640px) 70vw, 450px"
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
						<CollectionEmblaCarousel slides={collectionSlides} options={OPTIONS} />
					)}
				</section>
				<section className="w-full py-8 ">
					<h4 className="text-[rgba(5,5,5,0.9)] font-bold  flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] tracking-[0.06em] mb-6 mx-0 my-12 px-6 mt-6">
						Apparel
					</h4>
					{categorySlides.length > 0 && <CategoryEmblaCarousel slides={categorySlides} options={OPTIONS} />}
				</section>
				<section className="md:max-w-[560px] lg:max-w-[780px] m-[0_auto] w-full py-8 text-[rgb(5,5,5)]">
					<h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">

						Inspired Living from Dusk to Dawn</h5>
					<p style={{ fontFamily: "'HarmoniaSansProCyr', sans-serif" }} className="px-5 tracking-[0.02rem] text-[1rem] text-center">
						At Ridge & Dawn, we believe that life’s journey is defined by the small details. From home decor that inspires to apparel and footwear that empowers, and tech accessories that simplify your everyday, our curated collections are designed to elevate your lifestyle.</p>
				</section>
				<div className="px-2 py-5">
					<h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">
						Discover Our Collection
					</h5>
					<ProductList products={products} />
				</div>
				<WhyChooseUs />
			</div>
		</main>
	);
}
