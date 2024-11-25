import { GetPageBySlugDocument, GetPagesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { notFound } from "next/navigation";
import edjsHTML from "editorjs-html"
import "./style.css"
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const params = await props.params;

  const { page } = await executeGraphQL(GetPageBySlugDocument, {
    variables: {
      slug: decodeURIComponent(params?.slug),
    },
    revalidate: 60,
  });
  if (!page) {
    notFound();

  }
  return {
    title: page?.seoTitle || "",
    description: page?.seoDescription || "",
    alternates: {
      canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
        ? `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/page/${page?.slug}`
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  const { pages } = await executeGraphQL(GetPagesListDocument, { variables: { first: 100 }, revalidate: 60 });

  const paths = pages?.edges.map(({ node: { slug } }) => ({ slug })) || [];
  return paths;
}


export default async function PageBySlug(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const params = await props.params;

  const { page } = await executeGraphQL(GetPageBySlugDocument, {
    variables: {
      slug: decodeURIComponent(params?.slug),
    },
    revalidate: 60,
  });
  if (!page) {
    notFound();

  }
  const edjsParser = edjsHTML();
  const dataForParse = page?.content || "[]"
  const parse = JSON.parse(dataForParse) as { blocks: [] };
  let html = edjsParser.parse(parse);
  console.log(html)
  return (
    <main className="p-4 lg:p-8 max-w-auto lg:max-w-[60%] m-auto">
      <h1 className="text-3xl lg:text-6xl my-8 font-bold text-center leading-none tracking-tight text-foreground">
        {page.title}
      </h1>
      <div className="content">
        {html.map((element, index) => (
          <div key={String(index) + element} dangerouslySetInnerHTML={{ __html: element }}></div>
        ))}
      </div>
    </main>

  );
}
