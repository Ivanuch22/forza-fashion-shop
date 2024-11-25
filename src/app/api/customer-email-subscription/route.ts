import { CustomerCreateDocument } from "@/gql/graphql";
import { executeAdminGraphQL } from "@/lib/graphql";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Парсимо JSON як unknown
		const requestData: unknown = await request.json();

		// Перевіряємо, чи requestData має правильний тип
		if (isValidPaymentRequestBody(requestData)) {
			const data = await executeAdminGraphQL(CustomerCreateDocument, {
				variables: {
					input: {
						email: requestData.email,  // тепер TypeScript знає, що це рядок
						isActive: true
					},
				}
			});

			return NextResponse.json({ data: data });
		} else {
			return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: `internal server error: ${error}` }, { status: 500 });
	}
}

// Функція для перевірки типу даних
const isValidPaymentRequestBody = (data: unknown): data is CustomerRequestBody => {
	if (typeof data === "object" && data !== null) {
		const { email } = data as CustomerRequestBody;
		// Перевіряємо чи є email строкою
		return typeof email === "string" && email.includes("@");
	}
	return false;
};
interface CustomerRequestBody {
	email: string;
	isActive: boolean;
}