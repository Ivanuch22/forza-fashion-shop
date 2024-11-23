"use client"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accorion";
import { formatMoney } from "@/lib/graphql";
import { ChevronDown } from "lucide-react";
import { CartSummaryTable } from "@/ui/checkout/cart-summary-table";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";

const CartDetails = ({ locale }: { locale: string, }) => {
  const { checkout: cart } = useCheckoutStore((store) => store)
  return (
    <div className="max-w-[100vw] row-start-1 bg-[hsl(0,0%,96%)] border-t-[1px] border-b-[1px] border-[hsl(0,0%,87%)] border-solid lg:py-8 lg:row-start-auto lg:col-span-6 px-4 lg:px-8">
      {/* for biggest  dispay */}
      <div className="hidden lg:block sticky top-1 max-w-lg mr-auto ">
        <h1 className="lg:mb-4 lg:text-3xl lg:font-bold leading-none tracking-tight">{"Your Cart"}</h1>
        <CartSummaryTable cart={cart} locale={locale} />
      </div>
      {/* for smaller display */}

      <Accordion type="single" defaultValue="item-1" collapsible className="[&[data-state=open]>svg]:rotate-180 lg:hidden  sticky top-1 max-w-lg m-[0_auto] lg:mr-auto">
        <AccordionItem
          value={"value-1"}
          className="border-none pr-5"
        >
          <AccordionTrigger className=" text-lg sm:text-xl flex justify-between hover:no-underline ">
            <h1 className="lg:mb-4 lg:text-3xl flex text-[16px] lg:font-bold leading-none tracking-tight">
              Show order summary {" "}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </h1>
            <span className="font-semibold">{formatMoney(cart?.totalPrice?.gross?.amount || 0, cart?.totalPrice?.gross?.currency || "")}</span>
          </AccordionTrigger>
          <AccordionContent>
            <CartSummaryTable cart={cart} locale={locale} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
export default CartDetails