import { publicUrl } from "@/env.mjs";
import { getRecommendedProducts } from "@/lib/search/trieve";

import { formatMoney } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { getStripeAmountFromDecimal } from "commerce-kit/currencies";
import Image from "next/image";

export type TrieveProductMetadata = {
	name: string;
	description: string | null;
	slug: string;
	image_url: string | undefined;
	amount: number;
	currency: string;
	discount: string | number;
};

async function SimilarProducts({ id }: { id: string }) {
	const products = await getRecommendedProducts({ productId: id, limit: 4 });

	if (!products) {
		return null;
	}

	return (
		<section className="py-12 px-5 lg:px-10">
			<div className="mb-8">
				<h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
			</div>
			<div className="grid  sm:grid-cols-2 grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map((product) => {
					console.log(product, "similar producst");
					const trieveMetadata = product.metadata as TrieveProductMetadata;
					return (
						<div key={product.tracking_id} className="bg-card rounded overflow-hidden shadow group">
							{trieveMetadata.image_url && (
								<YnsLink href={`${publicUrl}${product.link}`} className="block" prefetch={false}>
									<Image
										className={
											"w-full rounded-lg bg-neutral-100 object-cover object-center group-hover:opacity-80 transition-opacity"
										}
										src={trieveMetadata.image_url}
										width={300}
										height={300}
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
										alt=""
									/>
								</YnsLink>
							)}
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">
									<YnsLink href={product.link || "#"} className="hover:text-primary" prefetch={false}>
										{trieveMetadata.name}
									</YnsLink>
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-sm md:text-lg ">
										{formatMoney({
											amount: getStripeAmountFromDecimal({
												amount: trieveMetadata?.amount,
												currency: trieveMetadata?.currency,
											}),
											currency: trieveMetadata.currency,
										})}
									</span>
									<p className="text-xs line-through ">
										{formatMoney({
											amount: getStripeAmountFromDecimal({
												amount: Number(trieveMetadata?.discount) || 0,
												currency: trieveMetadata?.currency,
											}),
											currency: trieveMetadata.currency,
										})}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
export default SimilarProducts;
