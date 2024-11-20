import type { CheckoutFindQuery } from "@/gql/graphql";
import { createStore } from "zustand/vanilla";

export type ICheckoutState = {
	checkout: CheckoutFindQuery["checkout"] | null;
};

export type ICheckoutActions = {
	changeCheckout: (cart: CheckoutFindQuery["checkout"]) => void;
};

export type ICheckoutStore = ICheckoutState & ICheckoutActions;

export const defaultInitState: ICheckoutState = {
	checkout: null,
};

export const createCheckoutStore = (initState: ICheckoutState = defaultInitState) => {
	return createStore<ICheckoutStore>()((set) => ({
		...initState,
		changeCheckout: (cart) => set((state) => ({ checkout: cart })),
	}));
};
