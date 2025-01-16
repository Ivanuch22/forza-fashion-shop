"use client";
import { addToCartAction } from "@/actions/cart-actions";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const AddToCartButton = ({
	productId,
	disabled,
}: {
	productId: string;
	disabled?: boolean;
}) => {
	const t = useTranslations("Global.addToCart");
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [loading, setLoading] = useState(false);
	const isDisabled = disabled || pending || loading;

	return (
		<Button
			id="button-add-to-cart"
			size="lg"
			type="submit"
			className="h-12 items-center rounded-md bg-[rgb(189,_9,_27)] px-6 py-3 text-base font-bold leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
			onClick={async (e) => {
				if (isDisabled) {
					e.preventDefault();
					return;
				}
				setLoading(true);
				const formData = new FormData();
				formData.append("productId", productId);
				await addToCartAction(formData);
				setLoading(false);
				startTransition(() => router.push(`/cart-overlay?add=${productId}`));
			}}
			aria-disabled={isDisabled}
		>
			<span className={cn("transition-opacity ease-in", loading ? "opacity-0" : "opacity-100")}>
				{disabled ? t("disabled") : t("actionButton")}
			</span>
			<span
				className={cn(
					"ease-out transition-opacity pointer-events-none absolute z-10",
					loading ? "opacity-100" : "opacity-0",
				)}
			>
				<Loader2Icon className="h-4 w-4 animate-spin" />
			</span>
		</Button>
	);
};
