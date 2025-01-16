"use client";
import type { Product, ProductVariant } from "@/gql/graphql";
import { useTranslations } from "@/i18n/client";
import { useRouter } from "next/navigation";
export default function ProductVarians({
	product,
	selectedVariant,
	variants,
}: { selectedVariant: ProductVariant; product: Product; variants: ProductVariant[] }) {
	const t = useTranslations("/product.page");
	return (
		<div className="grid gap-2">
			<p className="text-base font-medium" id="variant-label">
				{t("variantTitle")}
			</p>
			<VariantSelect productSlug={product.slug} selectedVariantId={selectedVariant.id} variants={variants} />
		</div>
	);
}

export function VariantSelect({
	productSlug,
	selectedVariantId,
	variants,
}: {
	productSlug: string;
	selectedVariantId: string;
	variants: ProductVariant[];
}) {
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const slug = e.target.value;
		router.push(`/product/${slug}`, { scroll: false });
	};

	return (
		<select
			name="variant-select"
			className="rounded-[10px]"
			defaultValue={`${productSlug}?variant=${selectedVariantId}`}
			onChange={handleChange}
		>
			{variants.map((variant) => (
				<option key={variant.id} value={`${productSlug}?variant=${variant.id}`}>
					{variant.name} {variant.quantityAvailable === 0 && "- Sold out"}
				</option>
			))}
		</select>
	);
}

// <ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
//   {variants.map((variant) => {
//     const isSelected = selectedVariant?.name === variant.name;
//     return (
//       variant.id && (
//         <li key={variant.id}>
//           <YnsLink
//             aria-label={`product variant ${variant.name}`}
//             scroll={false}
//             prefetch={true}
//             href={`/product/${product.slug}?variant=${variant.id}`}
//             className={cn(
//               "flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-neutral-100",
//               isSelected && "border-black bg-neutral-50 font-medium",
//             )}
//             aria-selected={isSelected}
//           >
//             {deslugify(variant.name)}
//           </YnsLink>
//         </li>
//       )
//     );
//   })}
// </ul>
