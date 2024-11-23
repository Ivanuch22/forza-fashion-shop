import { ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/products/product-list";

const MainProductList = async () => {
  const [data] = await Promise.all([
    executeGraphQL(ProductListDocument, { variables: { first: 8 }, revalidate: 60 }),
  ]);

  if (!data.products) throw Error("No products found");

  const products = data.products.edges.map(({ node: product }) => product);

  return (
    <div className="px-2 py-5">
      <h5 className="tracking-[0.02rem]   font-bold flex justify-center items-end gap-4 flex-wrap text-center text-[1.8rem] md:text-[2.3rem] mb-6 mx-0 my-12 px-6 mt-6">
        Discover Our Collection
      </h5>

      <ProductList products={products} />
    </div>
  )
}
export default MainProductList