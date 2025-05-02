"use server";

const pos_id = "123123";
// const MD5 = "123123";
// const client_id = "123123";
const client_secret = "123123";

export async function createAuthPayU() {
	try {
		const createPayUUrl = await fetch(`https://secure.payu.com/pl/standard/user/oauth/authorize`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "client_credentials",
				client_id: pos_id,
				client_secret: client_secret,
			}),
		});

		const status = createPayUUrl.ok;
		const data = (await createPayUUrl.json()) as { access_token: string };

		return { data, status };
	} catch (error) {
		console.error("Error in createAuthPayU:", error);
		return {
			data: null,
			status: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function createPaymentUrl(access_token: string, body: any) {
	try {
		const createPayUUrl = await fetch(`https://secure.payu.com/api/v2_1/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Changed from x-www-form-urlencoded to json
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify(body),
			redirect: "manual", // Important: don't automatically follow redirects
		});

		// Get the location header (payment URL)
		const redirectUrl = createPayUUrl.headers.get("location");

		const status = createPayUUrl.ok || createPayUUrl.status === 302; // Consider both 2xx and 302 as success

		let responseData;
		try {
			// Try to get response as JSON first
			responseData = await createPayUUrl.json();
		} catch {
			try {
				// If not JSON, try as text
				responseData = await createPayUUrl.text();
			} catch {
				// If can't get response, set as null
				responseData = null;
			}
		}

		return {
			data: responseData,
			status,
			redirectUrl, // Return the redirect URL
			statusCode: createPayUUrl.status,
		};
	} catch (error) {
		console.error("Error in createPaymentUrl:", error);
		return {
			data: null,
			status: false,
			error: error instanceof Error ? error.message : "Unknown error",
			redirectUrl: null,
		};
	}
}

export async function createPayment(body: any) {
	try {
		const getAccessToken = await createAuthPayU();

		if (!getAccessToken.status || !getAccessToken.data?.access_token) {
			return {
				success: false,
				error: "Failed to get access token",
				auth: getAccessToken,
				url: null,
				data: getAccessToken.data,
			};
		}

		const getUrl = await createPaymentUrl(getAccessToken.data.access_token, body);

		return {
			success: getUrl.status && !!getUrl.redirectUrl,
			paymentUrl: getUrl.redirectUrl, // This is what you need - the redirect URL
			auth: getAccessToken,
			url: getUrl,
			body,
		};
	} catch (error) {
		console.error("Error in createPayment:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			auth: null,
			url: null,
			body,
		};
	}
}
