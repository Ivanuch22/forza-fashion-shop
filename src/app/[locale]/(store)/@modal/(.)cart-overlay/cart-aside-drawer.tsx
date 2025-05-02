"use client";
import { Drawer, DrawerContent, DrawerTitle } from "@/ui/shadcn/drawer";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
export const CartAsideDrawer = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();
	const t = useTranslations("cart");
	const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				router.back();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [router]);

	return (
		<Drawer
			open={open}
			shouldScaleBackground={true}
			direction={"right"}
			onOpenChange={(e) => {
				if (!e) {
					if (timerId.current) {
						clearTimeout(timerId.current);
					}
					timerId.current = setTimeout(() => {
						router.back();
					}, 100);
				}
			}}
		>
			<DrawerTitle className="sr-only">{t("modal.title")}</DrawerTitle>
			<DrawerContent
				className="max-h-full min-h-full overflow-y-auto sm:fixed sm:bottom-0 left-auto sm:right-0 sm:top-0 sm:mt-0 sm:flex sm:h-full sm:w-2/3 sm:flex-col sm:overflow-hidden rounded-none sm:bg-white sm:shadow-xl lg:w-1/3"
				aria-describedby="cart-overlay-description"
				onPointerDownOutside={() => {
					setOpen(false);
				}}
				onEscapeKeyDown={() => {
					setOpen(false);
				}}
			>
				{children}
			</DrawerContent>
		</Drawer>
	);
};
