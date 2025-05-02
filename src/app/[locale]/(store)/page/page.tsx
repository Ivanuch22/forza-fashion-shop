import { GetPagesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { YnsLink } from "@/ui/yns-link";

export default async function PageBySlug() {
	const { pages } = await executeGraphQL(GetPagesListDocument, { variables: { first: 100 }, revalidate: 60 });
	return (
		<main className="p-4 lg:p-8 max-w-auto lg:max-w-[60%] m-auto">
			<h1 className="text-3xl lg:text-6xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				Pages
			</h1>
			<div className="grid ">
				{pages?.edges.map((page) => (
					<YnsLink key={page.node.id} href={`/page/${page?.node?.slug || ""}`} className="grid grid-cols-1">
						<h1 className="text-xl my-2">{page?.node?.title}</h1>
						{/* <p className="text-lg">{page?.node?.seoDescription}</p> */}
					</YnsLink>
				))}
			</div>
		</main>
	);
}
