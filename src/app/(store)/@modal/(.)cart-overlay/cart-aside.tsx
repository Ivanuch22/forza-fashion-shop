import type { ReactNode } from "react";
import { CartAsideDrawer } from "./cart-aside-drawer";

export const CartAsideContainer = ({
	children,
}: {
	children: ReactNode;
}) => {
	return (
		<CartAsideDrawer>
			<div className=" flex flex-1 flex-col">{children}</div>
		</CartAsideDrawer>
	);
};
