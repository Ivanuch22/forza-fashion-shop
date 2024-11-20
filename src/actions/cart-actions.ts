"use server";

import { CheckoutAddLineDocument } from "@/gql/graphql";
import { clearCartCookie, getCartCookieJson, setCartCookieJson } from "@/lib/cart";
import * as Checkout from "@/lib/checkout";
import { executeGraphQL } from "@/lib/graphql";
import * as Commerce from "commerce-kit";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const shouldUseHttps =
	process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;

export async function getCartFromCookiesAction() {
	const cookie = await cookies();
	let checkoutId = cookie.get("checkoutId")?.value;

	if (!checkoutId) {
		return null;
	}
	const cart = await Checkout.find(checkoutId);

	if (cart) {
		return cart;
	}
	return null;
}

export async function findOrCreateCartIdFromCookiesAction() {
	const cart = await getCartFromCookiesAction();
	if (cart) {
		return cart;
	}

	const newCart = await Commerce.cartCreate();
	setCartCookieJson({
		id: newCart.id,
		linesCount: 0,
	});
	revalidateTag(`cart-${newCart.id}`);

	return newCart.id;
}

export async function clearCartCookieAction() {
	const cookie = await getCartCookieJson();
	if (!cookie) {
		return;
	}

	clearCartCookie();
	revalidateTag(`cart-${cookie.id}`);
	// FIXME not ideal, revalidate per domain instead (multi-tenant)
	revalidateTag(`admin-orders`);
}

export async function addToCartAction(formData: FormData) {
	const productId = formData.get("productId");
	if (!productId || typeof productId !== "string") {
		throw new Error("Invalid product ID");
	}

	const cookie = await cookies();
	let checkoutId = cookie.get("checkoutId")?.value;

	if (!checkoutId) {
		const { checkoutCreate } = await Checkout.create();
		if (checkoutCreate?.checkout?.id) {
			cookie.set("checkoutId", checkoutCreate.checkout?.id, {
				secure: shouldUseHttps,
				sameSite: "lax",
				httpOnly: true,
			});
			checkoutId = checkoutCreate.checkout.id;
		}
	}

	if (checkoutId && productId) {
		const checkout = await Checkout.find(checkoutId);

		if (!checkout) {
			cookie.delete("checkoutId");
		}

		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkoutId,
				productVariantId: decodeURIComponent(productId),
			},
			cache: "no-cache",
		});
		revalidateTag(`cart-${productId}`);
	} else {
		throw new Error("Cart not found");
	}
}

export async function increaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.cart.id,
		operation: "INCREASE",
	});
}

export async function decreaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.cart.id,
		operation: "DECREASE",
	});
}

export async function setQuantity({
	productId,
	cartId,
	quantity,
}: {
	productId: string;
	cartId: string;
	quantity: number;
}) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartSetQuantity({ productId, cartId, quantity });
}
