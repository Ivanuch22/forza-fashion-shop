"use client";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithRef } from "react";

export const YnsLink = (props: ComponentPropsWithRef<typeof Link>) => {
	const router = useRouter();
	const strHref = typeof props.href === "string" ? props.href : props.href.href;

	const conditionalPrefetch = () => {
		if (strHref) {
			void router.prefetch(strHref);
		}
	};

	return (
		<Link
			{...props}
			prefetch={false}
			onMouseEnter={(e) => {
				conditionalPrefetch();
				return props.onMouseEnter?.(e);
			}}
			onPointerEnter={(e) => {
				conditionalPrefetch();
				return props.onPointerEnter?.(e);
			}}
			onTouchStart={(e) => {
				conditionalPrefetch();
				return props.onTouchStart?.(e);
			}}
			onFocus={(e) => {
				conditionalPrefetch();
				return props.onFocus?.(e);
			}}
		/>
	);
};
