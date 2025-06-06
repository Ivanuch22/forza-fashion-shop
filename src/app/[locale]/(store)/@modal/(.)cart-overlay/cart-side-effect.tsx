"use client";
import { useRouter } from "@/i18n/routing";
import { startTransition, useEffect, useRef } from "react";

// This is a side effect that is triggered when the user clicks on the "Add to cart" button.
// It will add the product to the cart in the background while the cart renders optimistically updated UI
export const CartModalAddSideEffect = ({ productId }: { productId: string }) => {
	const router = useRouter();
	const pendingRef = useRef(false);
	useEffect(() => {
		if (pendingRef.current || !productId) {
			return;
		}
		pendingRef.current = true;
		startTransition(async () => {
			pendingRef.current = false;

			// use `document.location.pathname` because `usePathname` returns stale value
			// while the router is transitioning
			if (document.location.pathname === "/cart-overlay") {
				// if user is still on the cart page, remove the query params and rerender
				router.replace("/cart-overlay", { scroll: false });
				router.refresh();
			}
		});
	}, [productId, router]);

	return null;
};
