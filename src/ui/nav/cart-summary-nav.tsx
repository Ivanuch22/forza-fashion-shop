import { CART_COOKIE } from "@/lib/cart";
import * as Checkout from "@/lib/checkout";
import CartToolTip from "@/ui/nav/cart-tooltip";
import { TooltipProvider } from "@/ui/shadcn/tooltip";
import { ShoppingBagIcon } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";

const CartFallback = () => (
	<div className="h-6 w-6 opacity-30">
		<ShoppingBagIcon />
	</div>
);

export const CartSummaryNav = () => {
	return (
		<Suspense fallback={<CartFallback />}>
			<CartSummaryNavInner />
		</Suspense>
	);
};

const CartSummaryNavInner = async () => {
	const cookie = await cookies();
	let checkoutId = cookie.get(CART_COOKIE)?.value || "";

	const cart = await Checkout.find(checkoutId);
	if (!cart) {
		return <CartFallback />;
	}
	if (!cart.lines.length) {
		return <CartFallback />;
	}

	return (
		<TooltipProvider>
			<CartToolTip cart={cart} />
		</TooltipProvider>
	);
};
