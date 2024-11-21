"use client"
import { type ICheckoutStore, createCheckoutStore } from "@/zustand/stores/checkout-store";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ICheckoutStoreApi = ReturnType<typeof createCheckoutStore>;
export const CheckoutStoreContext = createContext<ICheckoutStoreApi | undefined>(undefined);

export interface ICheckoutStoreProviderProps {
	children: ReactNode;
}

export const CheckoutStoreProvider = ({ children }: ICheckoutStoreProviderProps) => {
	// Ініціалізуємо useRef з початковим значенням null
	const storeRef = useRef<ICheckoutStoreApi | null>(null);

	if (!storeRef.current) {
		storeRef.current = createCheckoutStore(); // Створення магазину, якщо ще не ініціалізовано
	}

	return <CheckoutStoreContext.Provider value={storeRef.current!}>{children}</CheckoutStoreContext.Provider>;
};

export const useCheckoutStore = <T,>(selector: (store: ICheckoutStore) => T): T => {
	const checkoutStoreContext = useContext(CheckoutStoreContext);
	if (!checkoutStoreContext) {
		throw new Error("useCheckoutStore must be used within CheckoutStoreProvider");
	}
	return useStore(checkoutStoreContext, selector);
};