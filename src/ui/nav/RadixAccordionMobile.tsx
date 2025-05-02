"use client";
import { YnsLink } from "@/ui/yns-link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface IMenuItems {
	__typename?: "MenuItem";
	id: string;
	name: string;
	url?: string | null;
	category?: { __typename?: "Category"; slug: string } | null;
	collection?: { __typename?: "Collection"; slug: string } | null;
	page?: { __typename?: "Page"; slug: string } | null;
	children?: Array<{
		__typename?: "MenuItem";
		id: string;
		name: string;
		category?: { __typename?: "Category"; slug: string } | null;
		collection?: { __typename?: "Collection"; slug: string } | null;
		page?: { __typename?: "Page"; slug: string } | null;
		children?: Array<{
			__typename?: "MenuItem";
			id: string;
			name: string;
			category?: { __typename?: "Category"; slug: string } | null;
			collection?: { __typename?: "Collection"; slug: string } | null;
			page?: { __typename?: "Page"; slug: string } | null;
		}> | null;
	}> | null;
}

const RadixAccordionMobile = ({ items }: { items: IMenuItems[] }) => {
	const [activeItems, setActiveItems] = useState<Array<string>>([]);

	const handleLinkClick = () => {
		setActiveItems([]);
	};

	return (
		<Accordion.Root type="multiple" value={activeItems} onValueChange={setActiveItems} className="grid">
			{items.map((item) => (
				<AccordionItem key={item.id} item={item} onLinkClick={handleLinkClick} />
			))}
		</Accordion.Root>
	);
};

interface IAccordionProps {
	items: Array<IMenuItems | null> | null | undefined;
	onLinkClick: () => void;
}
const RadixAccordionChildren = ({ items, onLinkClick }: IAccordionProps) => {
	return (
		<Accordion.Root type="multiple" className="grid">
			{/* <div className="absolute border-[1px] border-black/50 rounded-lg p-2 border-solid grid z-10 bg-white"> */}
			{items?.map((item) => (
				<AccordionItemSecond key={item?.id} item={item} onLinkClick={onLinkClick} />
			))}
			{/* </div> */}
		</Accordion.Root>
	);
};

const RadixAccordionChildrenSecond = ({ items, onLinkClick }: IAccordionProps) => {
	return (
		<Accordion.Root type="multiple" className="grid">
			<div className="grid z-10 bg-white">
				{items?.map((item) => (
					<AccordionItemSecond key={item?.id} item={item} onLinkClick={onLinkClick} />
				))}
			</div>
		</Accordion.Root>
	);
};

const AccordionItem = ({
	item,
	onLinkClick,
}: { item: IMenuItems | null; onLinkClick: IAccordionProps["onLinkClick"] }) => {
	if (!item) return null;
	const hasChildren = item?.children && item?.children.length > 0;

	const getLinkUrl = () => {
		const { category, collection, page, url } = item;
		if (category?.slug) return `/category/${category.slug}`;
		if (collection?.slug) return `/collection/${collection.slug}`;
		if (page?.slug) return `/page/${page.slug}`;
		return url || "#";
	};

	return (
		<>
			{hasChildren && (
				<Accordion.Item value={item.id}>
					<Accordion.Header>
						<Accordion.Trigger className="text-[1.2rem]  font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
							<span>{item.name}</span>
							{hasChildren && (
								<ChevronDownIcon style={{ transition: "transform 0.3s", transform: "rotate(0deg)" }} />
							)}
						</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content>
						{hasChildren && (
							<div className="" style={{ marginLeft: "10px" }}>
								<RadixAccordionChildren items={item.children} onLinkClick={onLinkClick} />
							</div>
						)}
					</Accordion.Content>
				</Accordion.Item>
			)}
			{!hasChildren && (
				<YnsLink
					href={getLinkUrl()}
					className="text-[1.2rem]  font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
					onClick={onLinkClick} // Додаємо обробник кліку для закриття аккордеону
				>
					{item.name}
				</YnsLink>
			)}
		</>
	);
};

const AccordionItemSecond = ({
	item,
	onLinkClick,
}: { item: IMenuItems | null; onLinkClick: IAccordionProps["onLinkClick"] }) => {
	if (!item) return null;
	const hasChildren = item.children && item.children.length > 0;

	const getLinkUrl = () => {
		const { category, collection, page, url } = item;
		if (category?.slug) return `/category/${category.slug}`;
		if (collection?.slug) return `/collection/${collection.slug}`;
		if (page?.slug) return `/page/${page.slug}`;
		return url || "#";
	};

	return (
		<>
			{hasChildren ? (
				<Accordion.Item value={item.id}>
					<Accordion.Header>
						<Accordion.Trigger className="text-[1.2rem]  font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
							<span>{item.name}</span>
							<ChevronDownIcon style={{ transition: "transform 0.3s", transform: "rotate(0deg)" }} />
						</Accordion.Trigger>
					</Accordion.Header>

					<Accordion.Content>
						<div style={{ marginLeft: "10px" }}>
							<RadixAccordionChildrenSecond items={item.children} onLinkClick={onLinkClick} />
						</div>
					</Accordion.Content>
				</Accordion.Item>
			) : (
				<YnsLink
					href={getLinkUrl()}
					className="text-[1.2rem]  font-normal group inline-flex h-9 w-full items-center  rounded-md bg-transparent px-4 py-2  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
					onClick={onLinkClick} // Додаємо обробник кліку для закриття аккордеону
				>
					{item.name}
				</YnsLink>
			)}
		</>
	);
};

export default RadixAccordionMobile;
