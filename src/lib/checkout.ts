import {
	CheckoutCreateDocument,
	CheckoutDeleteLineDocument,
	CheckoutFindDocument,
	CheckoutUpdateLineDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function find(checkoutId: string) {
	const { checkout } = checkoutId
		? await executeGraphQL(CheckoutFindDocument, {
				variables: {
					id: checkoutId,
				},
				cache: "no-cache",
			})
		: { checkout: null };

	return checkout;
}
export async function updateCart(checkoutId: string, lines: { id: string; quantity: number }[]) {
	if (!checkoutId) {
		throw new Error("checkoutId is required");
	}
	if (!lines) {
		throw new Error("lineId is required");
	}
	const updateCheckout = await executeGraphQL(CheckoutUpdateLineDocument, {
		variables: {
			checkoutId: checkoutId,
			lines: lines.map(({ id, quantity }) => ({ lineId: id, quantity })),
		},
		cache: "no-store",
	});
	if (!updateCheckout.checkoutLinesUpdate?.checkout) {
		throw new Error(`Couldn't update lines in checkout.`);
	}
	return updateCheckout.checkoutLinesUpdate;
}

export async function deleteItem(checkoutId: string, lineId: string) {
	if (!checkoutId) {
		throw new Error("checkoutId is required");
	}
	if (!lineId) {
		throw new Error("lineId is required");
	}
	const checkoutLineDelete = await executeGraphQL(CheckoutDeleteLineDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});
	return checkoutLineDelete?.checkoutLinesDelete;
}

export const create = () => executeGraphQL(CheckoutCreateDocument, { cache: "no-cache" });
