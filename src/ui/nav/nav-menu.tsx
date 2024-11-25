import { GetNavigationDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import RadixAccordion from "@/ui/nav/RadixAccordion";
import RadixAccordionMobile from "@/ui/nav/RadixAccordionMobile";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";


export const NavMenu = async () => {
	const navLinks = await executeGraphQL(GetNavigationDocument, {
		variables: { slug: "navbar" },
		revalidate: 60 * 60 * 24,
	});
	return (
		<>
			<div className="sm:block hidden">
				<ul className="flex flex-row items-center justify-center gap-x-1">
					<RadixAccordion items={navLinks?.menu?.items} />
				</ul>
			</div>
			<div className="sm:hidden  flex items-center min-h-full ">
				<NavMobileMenu className="">
					<ul className="h-full flex pb-8 font-normal flex-col items-stretch justify-start gap-x-1  pt-3">
						<RadixAccordionMobile items={navLinks?.menu?.items} />
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
