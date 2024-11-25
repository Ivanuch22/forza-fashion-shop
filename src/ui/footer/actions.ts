"use server";

import { env } from "@/env.mjs";

export async function signForNewsletter(formData: FormData) {
	const email = formData.get("email");
	if (typeof email !== "string" || !email?.includes("@")) {
		return;
	}
	console.log(env.NEXT_SECRET_NEWSLETTER_ENDPOINT)

	if (!env.NEXT_SECRET_NEWSLETTER_ENDPOINT) {
		return;
	}

	const result = await fetch(env.NEXT_PUBLIC_URL + env.NEXT_SECRET_NEWSLETTER_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	const json = await result.json();
	return json as {
		status: number;
	};
}
