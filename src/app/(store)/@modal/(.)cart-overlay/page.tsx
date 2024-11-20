import ClientBlock from "@/app/(store)/@modal/(.)cart-overlay/components/client-block";
import { cookies } from "next/headers";
import { CartAsideContainer } from "./cart-aside";

export default async function CartModalPage(props: { searchParams: Promise<{ add?: string }> }) {
	const [searchParamss, cookie] = await Promise.all([props.searchParams, cookies()]);
	let checkoutId = cookie.get("checkoutId")?.value || "";
	return (
		<CartAsideContainer>
			<ClientBlock searchParams={searchParamss} checkoutID={checkoutId} />
		</CartAsideContainer>
	);
}
