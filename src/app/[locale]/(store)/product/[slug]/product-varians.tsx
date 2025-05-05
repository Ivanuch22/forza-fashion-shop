"use client";
import type { Product, ProductVariant } from "@/gql/graphql";
import { useRouter } from "@/i18n/routing";

import { useTranslations } from "next-intl";

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
