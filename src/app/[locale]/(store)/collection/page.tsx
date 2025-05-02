import { GetAllCollectionsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { deslugify } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { cookies } from "next/headers";
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
	const cookie = await cookies();
	const channel = cookie.get("channel")?.value || "default-channel";

	const { collections } = await executeGraphQL(GetAllCollectionsDocument, {
		variables: {
			first: 100,
			channel,
		},
		revalidate: 60,
	});

	return (
		<main className="pb-8 px-4">
			<h1 className="text-3xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				All collections
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-[40px] gap-[20px] pt-10">
					{collections?.edges.map((collection) => (
						<YnsLink
							key={collection.node.id}
							href={`/collection/${collection.node?.slug}`}
							className="bg-white shadow-lg rounded-lg  text-black group relative overflow-hidden "
						>
							<div className="relative pb-[70%] overflow-hidden">
								{collection.node?.backgroundImage && (
									<Image
										alt={collection.node?.backgroundImage?.alt || "Cover image"}
										className="w-full h-auto scale-105 object-cover transition-all group-hover:scale-[108%] group-hover:opacity-75 absolute"
										sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 620px"
										src={collection.node?.backgroundImage?.url || ""}
										width={100}
										height={100}
									/>
								)}
							</div>
							<div className="justify-end gap-2 px-2 py-3 lg:px-4 lg:py-6 text-black">
								<h3 className="text-xl font-bold text-center">{deslugify(collection.node.slug)}</h3>
							</div>
						</YnsLink>
					))}
				</div>
			</h1>
		</main>
	);
}
