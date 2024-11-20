"use client";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";

const TotalItems = () => {
	const { checkout } = useCheckoutStore((state) => state);
	const total = checkout?.lines.reduce((acc, item) => +acc + +item.quantity, 0);
	return <>{total ?? 0}</>;
};
export default TotalItems;
