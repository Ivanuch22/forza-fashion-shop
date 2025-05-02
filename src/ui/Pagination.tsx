import { YnsLink } from "@/ui/yns-link";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";

export async function Pagination({
	pageInfo,
}: {
	pageInfo:
		| {
				__typename?: "PageInfo" | undefined;
				hasPreviousPage?: boolean | undefined;
				startCursor?: string | null | undefined;
				endCursor?: string | null | undefined;
				hasNextPage: boolean;
		  }
		| undefined;
}) {
	const t = await getTranslations("/category");
	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<YnsLink
				href={pageInfo?.hasNextPage ? `?cursor=${pageInfo?.endCursor}` : "#"}
				className={clsx("px-4 py-2 text-sm font-medium ", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": pageInfo?.hasNextPage,
					"cursor-not-allowed rounded border text-neutral-400": !pageInfo?.hasNextPage,
				})}
				aria-disabled={!pageInfo?.hasNextPage}
			>
				{t("slug.nextPageBtn")}
			</YnsLink>
		</nav>
	);
}
