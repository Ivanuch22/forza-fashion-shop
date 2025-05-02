import ViewStripe from "@/app/[locale]/(store)/testing-stripe/components/view";
import { cookies } from "next/headers";

export default async function TestingStripePage() {
	const cookie = await cookies();
	let currency = cookie.get("currency")?.value || "currency";

	return (
		<>
			<ViewStripe currency={currency} />
		</>
	);
}
