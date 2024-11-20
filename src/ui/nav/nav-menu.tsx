import { MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";
import Link from "next/link";

export const NavMenu = async () => {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar" },
		revalidate: 60 * 60 * 24,
	});
	return (
		<>
			<div className="sm:block hidden">
				<ul className="flex flex-row items-center justify-center gap-x-1">
					{navLinks.menu?.items
						?.map((item) => item.category)
						.filter(Boolean)
						.map((category) => (
							<Link
								className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
								key={category.id}
								href={`/category/${category.slug}`}
							>
								{category.name}
							</Link>
						))}
				</ul>
			</div>
			<div className="sm:hidden relative flex items-center min-h-full ">
				<NavMobileMenu className="">
					<ul className="h-full flex pb-8 font-normal flex-col items-stretch justify-start gap-x-1  pt-3">
						<Link
							href={"/"}
							className="text-[1.2rem]  font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
						>
							Home
						</Link>
						{navLinks.menu?.items
							?.map((item) => item.category)
							.filter(Boolean)
							.map((category) => (
								<Link
									className="text-[1.2rem] font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
									key={category.id}
									href={`/category/${category.slug}`}
								>
									{category.name}
								</Link>
							))}
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
