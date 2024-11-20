// src/providers/counter-store-provider.tsx
"use client";

import { type ICheckoutStore, createCheckoutStore } from "@/zustand/stores/checkout-store";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ICheckoutStoreApi = ReturnType<typeof createCheckoutStore>;
export const CheckoutStoreContext = createContext<ICheckoutStoreApi | undefined>(undefined);

export interface ICheckoutStoreProviderProps {
	children: ReactNode;
}
export const CheckoutStoreProvider = ({ children }: ICheckoutStoreProviderProps) => {
	const storeRef = useRef<ICheckoutStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createCheckoutStore();
	}

	return <CheckoutStoreContext.Provider value={storeRef.current}>{children}</CheckoutStoreContext.Provider>;
};
export const useCheckoutStore = <T,>(selector: (store: ICheckoutStore) => T): T => {
	const checkoutStoreContext = useContext(CheckoutStoreContext);
	if (!checkoutStoreContext) {
		throw new Error("useCheckoutStore must be used within ChekcoutStoreProvider");
	}
	return useStore(checkoutStoreContext, selector);
};
