import { GetAllCategoriesDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next/types";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	return {
		title: `All Category · `,
		description: "All category description ",
	};
};

export default async function CategoryPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const { categories } = await executeGraphQL(GetAllCategoriesDocument, {
		variables: {
			first: 100,
		},
		revalidate: 60,
	});
	const t = await getTranslations("/category");
	return (
		<main className="pb-8 px-4">
			<h1 className="text-3xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				{t("page.title")}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-[40px] gap-[20px] pt-10">
					{categories?.edges.map((categorie) => (
						<YnsLink
							key={categorie.node.id}
							href={`/category/${categorie.node?.slug}`}
							className="bg-white shadow-lg rounded-lg  text-black group relative overflow-hidden "
						>
							<div className="relative pb-[70%] overflow-hidden">
								{categorie.node?.backgroundImage && (
									<Image
										alt={categorie.node?.backgroundImage?.alt || "Cover image"}
										className="w-full h-auto scale-105 object-cover transition-all group-hover:scale-[108%] group-hover:opacity-75 absolute"
										sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 620px"
										src={categorie.node?.backgroundImage?.url || ""}
										width={100}
										height={100}
									/>
								)}
							</div>
							<div className="justify-end gap-2 px-2 py-3 lg:px-4 lg:py-6 text-black">
								<h3 className="text-xl font-bold text-center">{deslugify(categorie.node.slug)}</h3>
							</div>
						</YnsLink>
					))}
				</div>
			</h1>
		</main>
	);
}
