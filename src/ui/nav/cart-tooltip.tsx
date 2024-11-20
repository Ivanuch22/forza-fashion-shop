"use client";
import type { CheckoutFindQuery } from "@/gql/graphql";
import { formatMoney } from "@/lib/graphql";
import TotalItems from "@/ui/nav/total-items";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shadcn/tooltip";
import { YnsLink } from "@/ui/yns-link";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import { ShoppingBagIcon } from "lucide-react";
import { useEffect } from "react";

const CartToolTip = ({ cart }: { cart: CheckoutFindQuery["checkout"] }) => {
	const { checkout, changeCheckout } = useCheckoutStore((state) => state);
	useEffect(() => {
		changeCheckout(cart);
	}, [cart]);
	const currency = cart?.totalPrice?.gross?.currency || "";
	const total = checkout?.lines.reduce((acc, item) => +acc + +item.quantity, 0);

	return (
		<>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<div>
						<YnsLink href="/cart-overlay" scroll={false} className="relative block h-6 w-6" prefetch={false}>
							<ShoppingBagIcon />
							<span className="absolute bottom-0 right-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
								<span className="sr-only">Total: </span>
								<TotalItems />
							</span>
							<span className="sr-only">
								Total: {formatMoney(checkout?.totalPrice?.gross?.amount || 0, currency)}
							</span>
						</YnsLink>
					</div>
				</TooltipTrigger>
				<TooltipContent side="left" sideOffset={25}>
					<p>{total}: items in cart </p>
					<p>Total: {formatMoney(checkout?.totalPrice?.gross?.amount || 0, currency)}</p>
				</TooltipContent>
			</Tooltip>
		</>
	);
};
export default CartToolTip;
