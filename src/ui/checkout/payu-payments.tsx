"use client";
import { clearCartCookieAction } from "@/actions/cart-actions";
import { createPayment } from "@/actions/create-auth";
import { formatMoney } from "@/lib/graphql";
import { saveTaxIdAction } from "@/ui/checkout/tax-action";
import { CountrySelect } from "@/ui/country-select";
import { InputWithErrors } from "@/ui/input-errors";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { Label } from "@/ui/shadcn/label";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import { AddressSchema, getAddressSchema } from "commerce-kit";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEventHandler, useState, useTransition } from "react";

interface IPayUPaymentsProps {
	channel: string;
	locale: string;
}
export default function PayUPayments({ channel, locale }: IPayUPaymentsProps) {
	const t = useTranslations("cart.page.stripePayment");
	const ft = useTranslations("cart.page.formErrors");
	const addressSchema = getAddressSchema({
		cityRequired: ft("cityRequired"),
		countryRequired: ft("countryRequired"),
		line1Required: ft("line1Required"),
		nameRequired: ft("nameRequired"),
		postalCodeRequired: ft("postalCodeRequired"),
	});
	const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning] = useTransition();
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof AddressSchema, string[] | null | undefined>>
	>({});
	const [shippingAddressValues, setShippingAddressValues] = useState<AddressSchema>({
		email: "",
		name: "",
		city: "",
		country: "",
		line1: "",
		line2: "",
		postalCode: "",
		state: "",
		phone: "",
		taxId: "",
	});
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [acceptPrivacy, setAcceptPrivacy] = useState(false);
	const [checkboxErrors, setCheckboxErrors] = useState<{
		terms?: string;
		privacy?: string;
	}>({});
	const { checkout } = useCheckoutStore((state) => state);
	const router = useRouter();

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const errors: { terms?: string; privacy?: string } = {};
		if (!acceptTerms) {
			errors.terms = "Akceptacja Regulaminu jest wymagana";
		}
		if (!acceptPrivacy) {
			errors.privacy = "Zgoda na przetwarzanie danych osobowych jest wymagana";
		}
		if (Object.keys(errors).length > 0) {
			setCheckboxErrors(errors);
			setFormErrorMessage("Proszę zaakceptować wymagane zgody przed złożeniem zamówienia");
			return;
		}
		setCheckboxErrors({});
		setFormErrorMessage(null);

		try {
			const billingAddress: Partial<AddressSchema> = shippingAddressValues;
			const shipingAddress: Partial<AddressSchema> = shippingAddressValues;
			const validatedBillingAddress = addressSchema.safeParse(billingAddress);
			const validatedShippingAddress = addressSchema.safeParse(shippingAddressValues);

			if (!validatedBillingAddress.success) {
				setFieldErrors(validatedBillingAddress.error?.flatten().fieldErrors ?? {});
			} else {
				setFieldErrors({});
			}
			if (!validatedShippingAddress.success || !validatedBillingAddress.success) {
				console.error("Validation failed", {
					validatedShippingAddress,
					validatedBillingAddress,
				});
				setFormErrorMessage(t("fillRequiredFields"));
				return;
			}

			setIsLoading(true);
			if (validatedBillingAddress.data.taxId) {
				await saveTaxIdAction({
					taxId: validatedBillingAddress.data.taxId,
				});
			}
			const saleorDataPrepare = {
				channelId: channel,
				billingAddress: {
					city: billingAddress.city || "",
					cityArea: "",
					companyName: "",
					country: billingAddress.country ?? "",
					countryArea: "",
					firstName: billingAddress.name || "",
					lastName: "",
					phone: billingAddress.phone ?? "",
					postalCode: billingAddress.postalCode || "",
					streetAddress1: billingAddress.line1 || "",
					streetAddress2: billingAddress.line2 ?? "",
				},
				user: billingAddress.email ?? "",
				userEmail: billingAddress.email ?? "",
				lines: checkout?.lines.map((line) => ({ variantId: line.variant.id, quantity: line.quantity })) || [],
				shippingAddress: {
					city: shipingAddress.city || "",
					cityArea: "",
					companyName: "",
					country: shipingAddress.country ?? "",
					countryArea: "",
					firstName: shipingAddress.name || "",
					lastName: "",
					phone: shipingAddress.phone ?? "",
					postalCode: shipingAddress.postalCode || "",
					streetAddress1: shipingAddress.line1 || "",
					streetAddress2: shipingAddress.line2 ?? "",
				},
			};

			const createOrderInSaleor = await fetch("/api/saleor-create-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: saleorDataPrepare }),
			});
			console.log(createOrderInSaleor);
			const pos_id = "123123";

			const result: any = {};
			const prepareDataForPayment = {
				continueUrl: `${window.location.origin}/order/success`,
				notifyUrl: `${window.location.origin}/order/notify`,
				customerIp: "127.0.0.1",
				merchantPosId: pos_id,
				description: "Standard Order: 3",
				additionalDescription: "Standard Order",
				visibleDescription: "Order Description",
				currencyCode: "PLN",
				extOrderId: "Standard Order: 312",
				totalAmount: (checkout?.totalPrice?.gross?.amount || 0) * 100,
				buyer: {
					extCustomerId: "123123",
					email: shippingAddressValues.email,
					phone: shippingAddressValues.phone,
					firstName: shippingAddressValues.name,
					lastName: shippingAddressValues.name,
					nin: "1",
					language: "en",
				},
				products:
					checkout?.lines.map((line) => ({
						name: line.variant.name,
						unitPrice: line.variant.pricing?.price?.gross.amount,
						quantity: line.quantity,
					})) || [],
			};
			const fetcs = await createPayment(prepareDataForPayment);
			console.log(fetcs);

			if (result.error) {
				setIsLoading(false);
				setFormErrorMessage(result.error.message ?? t("unexpectedError"));
			} else {
				const createOrderInSaleor: any = {};
				if (!createOrderInSaleor?.ok && false) {
					setIsLoading(false);
					const errorMessage = await createOrderInSaleor?.text();
					setFormErrorMessage(errorMessage || t("unexpectedError"));
				}

				await clearCartCookieAction();
				const params = new URLSearchParams({
					payment_intent: result.paymentIntent.id,
					payment_intent_client_secret: result?.paymentIntent?.client_secret ?? "",
				});
				router.push("/order/success?" + params.toString());
			}
		} catch (error) {
			setIsLoading(false);
			setFormErrorMessage(error instanceof Error ? error.message : t("unexpectedError"));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<ShippingAddressSection
				values={shippingAddressValues}
				onChange={setShippingAddressValues}
				errors={fieldErrors}
			/>
			<div className="space-y-1">
				<Label className="flex flex-row items-center gap-x-2">
					<Checkbox
						onCheckedChange={(checked) => setAcceptTerms(checked === true)}
						checked={acceptTerms}
						name="acceptTerms"
						value={acceptTerms ? "true" : "false"}
						required
					/>
					<span>{t("acceptTerms")}</span>
				</Label>
				{checkboxErrors.terms && <p className="text-sm text-red-500 pl-6">{checkboxErrors.terms}</p>}
			</div>
			<div className="space-y-1">
				<Label className="flex flex-row items-center gap-x-2">
					<Checkbox
						onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
						checked={acceptPrivacy}
						name="acceptPrivacy"
						value={acceptPrivacy ? "true" : "false"}
						required
					/>
					<span>{t("acceptPrivacy")}</span>
				</Label>
				{checkboxErrors.privacy && <p className="text-sm text-red-500 pl-6">{checkboxErrors.privacy}</p>}
			</div>
			{formErrorMessage && (
				<Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
					<AlertCircle className="-mt-1 h-4 w-4" />
					<AlertTitle>{t("errorTitle")}</AlertTitle>
					<AlertDescription>{formErrorMessage}</AlertDescription>
				</Alert>
			)}
			<Button
				type="submit"
				className="w-full rounded-full text-lg"
				size="lg"
				aria-disabled={isLoading || isTransitioning}
				onClick={(e) => {
					if (isLoading || isTransitioning) {
						e.preventDefault();
					}
				}}
			>
				{isLoading || isTransitioning ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<>
						{t("payNowButton")} •{" "}
						{checkout?.totalPrice?.gross?.amount &&
							formatMoney(
								checkout?.totalPrice?.gross?.amount || 0,
								checkout?.totalPrice?.gross?.currency || "",
							)}
					</>
				)}
			</Button>
		</form>
	);
}

const ShippingAddressSection = ({
	values,
	onChange,
	errors,
}: {
	values: AddressSchema;
	onChange: (values: AddressSchema) => void;
	errors: Record<string, string[] | null | undefined>;
}) => {
	const t = useTranslations("cart.page.stripePayment");
	const onFieldChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		onChange({ ...values, [name]: value });
	};

	return (
		<>
			<InputWithErrors
				required
				label={"Email"}
				name="email"
				defaultValue={values.name ?? undefined}
				autoComplete="shipping email"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				required
				label={t("fullName")}
				name="name"
				defaultValue={values.name ?? undefined}
				autoComplete="shipping name"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				required
				label={t("address1")}
				name="line1"
				defaultValue={values.line1 ?? undefined}
				autoComplete="shipping address-line1"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				label={t("address2")}
				name="line2"
				defaultValue={values.line2 ?? undefined}
				autoComplete="shipping address-line2"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<InputWithErrors
					required
					label={t("postalCode")}
					name="postalCode"
					defaultValue={values.postalCode ?? undefined}
					autoComplete="shipping postal-code"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<InputWithErrors
					required
					label={t("city")}
					name="city"
					defaultValue={values.city ?? undefined}
					autoComplete="shipping home city"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-1">
				<InputWithErrors
					label={t("state")}
					name="state"
					defaultValue={values.state ?? undefined}
					autoComplete="shipping address-level1"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<CountrySelect
					label={t("country")}
					name="country"
					autoComplete="shipping country"
					onChangeValue={(value) => onChange({ ...values, country: value })}
					value={values.country ?? ""}
					errors={errors}
				/>
			</div>
			<InputWithErrors
				required
				label={t("phone")}
				name="phone"
				defaultValue={values.phone ?? undefined}
				autoComplete="shipping tel"
				type="tel"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("taxId")}
				name="taxId"
				defaultValue={values.taxId ?? undefined}
				autoComplete=""
				placeholder={t("taxIdPlaceholder")}
				type="text"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
		</>
	);
};
