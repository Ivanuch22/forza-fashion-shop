import { DraftOrderCreateDocument } from "@/gql/graphql";
import type { DraftOrderCreateMutationVariables } from "@/gql/graphql";
import { executeAdminGraphQL } from "@/lib/graphql";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { input }: DraftOrderCreateMutationVariables = await request.json();
		if (!input) {
			return NextResponse.json({ message: "Input is required" }, { status: 500 });
		}
		console.log(input, "input");
		const createOrderInSaleor = await executeAdminGraphQL(DraftOrderCreateDocument, {
			variables: {
				input: {
					...input,
				},
			},
		});
		const response = NextResponse.json({
			createdOrder: createOrderInSaleor,
			message: "Order Create Succesfull",
		});
		response.cookies.set("checkoutId", "", {
			expires: new Date(0), // Set the expiration date to the past to delete the cookie
		});
		return response;
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: `internal server error: ${error}` }, { status: 500 });
	}
}
