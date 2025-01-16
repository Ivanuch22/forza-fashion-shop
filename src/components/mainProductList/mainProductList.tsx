import { ProductList } from "@/ui/products/product-list";

interface IMainProduct {
	__typename?: "Product";
	id: string;
	name: string;
	slug: string;
	pricing?: {
		__typename?: "ProductPricingInfo";
		priceRangeUndiscounted?: {
			__typename?: "TaxedMoneyRange";
			start?: {
				__typename?: "TaxedMoney";
				gross: { __typename?: "Money"; amount: number; currency: string };
			} | null;
		} | null;
		priceRange?: {
			__typename?: "TaxedMoneyRange";
			start?: {
				__typename?: "TaxedMoney";
				gross: { __typename?: "Money"; amount: number; currency: string };
			} | null;
			stop?: {
				__typename?: "TaxedMoney";
				gross: { __typename?: "Money"; amount: number; currency: string };
			} | null;
		} | null;
	} | null;
	category?: {
		__typename?: "Category";
		name: string;
		description?: string | null;
		seoDescription?: string | null;
		seoTitle?: string | null;
		slug: string;
		id: string;
	} | null;
	thumbnail?: {
		__typename?: "Image";
		url: string;
		alt?: string | null;
	} | null;
}

const MainProductList = async ({ products }: { products: IMainProduct[] | undefined | null }) => {
	return (
		<div className="px-2 py-5">
			<h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">
				Discover Our Collection
			</h5>

			<ProductList products={products || []} />
		</div>
	);
};
export default MainProductList;
