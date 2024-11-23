// @ts-nocheck
"use client";
import type { MenuItem } from "@/gql/graphql";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";

const RadixAccordion = ({ items }: { items }) => {
  const [activeItems, setActiveItems] = useState([]);

  const handleLinkClick = () => {
    // Закриваємо всі елементи аккордеону при кліку на лінку
    setActiveItems([]);
  };

  return (
    <Accordion.Root
      type="multiple"
      value={activeItems}
      onValueChange={setActiveItems}
      className="flex items-center"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} item={item} onLinkClick={handleLinkClick} />
      ))}
    </Accordion.Root>
  );
};

const RadixAccordionChildren = ({ items, onLinkClick }) => {
  return (
    <Accordion.Root type="multiple" className="grid">
      <div className="absolute border-[1px] border-black/50 rounded-lg p-2 border-solid grid z-10 bg-white">
        {items.map((item) => (
          <AccordionItemSecond key={item.id} item={item} onLinkClick={onLinkClick} />
        ))}
      </div>
    </Accordion.Root>
  );
};

const RadixAccordionChildrenSecond = ({ items, onLinkClick }) => {
  return (
    <Accordion.Root type="multiple" className="grid">
      <div className="grid z-10 bg-white">
        {items.map((item) => (
          <AccordionItemSecond key={item.id} item={item} onLinkClick={onLinkClick} />
        ))}
      </div>
    </Accordion.Root>
  );
};

const AccordionItem = ({ item, onLinkClick }) => {
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
      {hasChildren && (
        <Accordion.Item value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger className="group my-2 inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
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
        <Link
          href={getLinkUrl()}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none max-w-[130px] "
          onClick={onLinkClick} // Додаємо обробник кліку для закриття аккордеону
        >
          {item.name}
        </Link>
      )}
    </>
  );
};

const AccordionItemSecond = ({ item, onLinkClick }) => {
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
            <Accordion.Trigger className="group my-2 inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none max-w-[130px] ">
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
        <Link
          href={getLinkUrl()}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none max-w-[130px] "
          onClick={onLinkClick} // Додаємо обробник кліку для закриття аккордеону
        >
          {item.name}
        </Link>
      )}
    </>
  );
};

export default RadixAccordion;
