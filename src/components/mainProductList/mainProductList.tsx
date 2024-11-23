import type { Product } from "@/gql/graphql";
import { ProductList } from "@/ui/products/product-list";

const MainProductList = async ({ products }: { products: Product[] | undefined | null }) => {
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
