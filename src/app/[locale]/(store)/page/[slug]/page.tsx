import { GetPageBySlugDocument, GetPagesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import edjsHTML from "editorjs-html";
import { notFound } from "next/navigation";
import "./style.css";
import { mapLocaleToLanguageCode } from "@/lib/mapLocaleToLanguageCode";

export async function generateMetadata(props: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const params = await props.params;
	const { slug, locale } = params;

	const { page } = await executeGraphQL(GetPageBySlugDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			languageCode: mapLocaleToLanguageCode(locale),
		},
		revalidate: 60,
	});

	if (!page) {
		notFound();
	}

	// Use translated content if available, otherwise fall back to default
	const title = page.translation?.seoTitle || page.seoTitle || "";
	const description = page.translation?.seoDescription || page.seoDescription || "";

	return {
		title,
		description,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/${locale}/pages/${page?.slug}`
				: undefined,
		},
	};
}

export async function generateStaticParams() {
	const { pages } = await executeGraphQL(GetPagesListDocument, {
		variables: { first: 100 },
		revalidate: 60,
	});

	const locales = ["en", "pl"]; // Your configured locales

	// Generate paths for each page in each locale
	const paths: { slug: string; locale: string }[] = [];

	pages?.edges.forEach(({ node: { slug } }) => {
		locales.forEach((locale) => {
			paths.push({ slug, locale });
		});
	});

	return paths;
}

export default async function PageBySlug(props: {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const params = await props.params;
	const { slug, locale } = params;

	const { page } = await executeGraphQL(GetPageBySlugDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			languageCode: mapLocaleToLanguageCode(locale),
		},
		revalidate: 60,
	});

	if (!page) {
		notFound();
	}

	// Use translated content if available, otherwise fall back to default
	const pageContent = page.translation?.content || page.content || "[]";
	const pageTitle = page.translation?.title || page.title;

	const edjsParser = edjsHTML();
	const parse = JSON.parse(pageContent) as { blocks: [] };
	let html = edjsParser.parse(parse);

	return (
		<main className="p-4 lg:p-8 max-w-auto lg:max-w-[60%] m-auto">
			<h1 className="text-3xl lg:text-6xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
				{pageTitle}
			</h1>
			<div className="content">
				{html.map((element, index) => (
					<div key={String(index) + element} dangerouslySetInnerHTML={{ __html: element }}></div>
				))}
			</div>
		</main>
	);
}
