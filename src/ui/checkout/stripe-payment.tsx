"use client";
import { clearCartCookieAction } from "@/actions/cart-actions";
import { formatMoney } from "@/lib/graphql";
import { useDebouncedValue } from "@/lib/hooks";
import { saveShippingRateAction } from "@/ui/checkout/checkout-actions";
import { type AddressSchema, getAddressSchema } from "@/ui/checkout/checkout-form-schema";
import { ShippingRatesSection } from "@/ui/checkout/shipping-rates-section";
import { saveTaxIdAction } from "@/ui/checkout/tax-action";
import { CountrySelect } from "@/ui/country-select";
import { InputWithErrors } from "@/ui/input-errors";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { Collapsible, CollapsibleContent } from "@/ui/shadcn/collapsible";
import { Label } from "@/ui/shadcn/label";
import { useCheckoutStore } from "@/zustand/providers/checkout-store-provider";
import {
	AddressElement,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type * as Commerce from "commerce-kit";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEventHandler, useState, useTransition } from "react";

export const StripePayment = ({
	channel,
	shippingRateId,
	shippingRates,
	allProductsDigital,
	locale,
}: {
	channel: string;
	shippingRateId?: string | null;
	shippingRates: Commerce.MappedShippingRate[];
	allProductsDigital: boolean;
	locale: string;
}) => {
	return (
		<PaymentForm
			channel={channel}
			shippingRates={shippingRates}
			cartShippingRateId={shippingRateId ?? null}
			allProductsDigital={allProductsDigital}
			locale={locale}
		/>
	);
};

const PaymentForm = ({
	channel,
	shippingRates,
	cartShippingRateId,
	allProductsDigital,
	locale,
}: {
	channel: string;
	shippingRates: Commerce.MappedShippingRate[];
	cartShippingRateId: string | null;
	allProductsDigital: boolean;
	locale: string;
}) => {
	const t = useTranslations("cart.page.stripePayment");
	const ft = useTranslations("cart.page.formErrors");

	const addressSchema = getAddressSchema({
		cityRequired: ft("cityRequired"),
		countryRequired: ft("countryRequired"),
		line1Required: ft("line1Required"),
		nameRequired: ft("nameRequired"),
		postalCodeRequired: ft("postalCodeRequired"),
	});

	const { checkout } = useCheckoutStore((state) => state);

	const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof AddressSchema, string[] | null | undefined>>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning, transition] = useTransition();
	const [isLinkAuthenticationReady, setIsLinkAuthenticationReady] = useState(false);
	const [isAddressReady, setIsAddressReady] = useState(false);
	const [isPaymentReady, setIsPaymentReady] = useState(false);
	const [billingAddressValues, setBillingAddressValues] = useState<AddressSchema>({
		name: "",
		city: "",
		country: "",
		line1: "",
		line2: "",
		postalCode: "",
		state: "",
		phone: "",
		taxId: "",
		email: "",
	});

	const [isBillingAddressPending] = useDebouncedValue(billingAddressValues, 1000);
	const [shippingRateId, setShippingRateId] = useState<string | null>(cartShippingRateId);

	const [sameAsShipping, setSameAsShipping] = useState(true);

	const [acceptTerms, setAcceptTerms] = useState(false);
	const [acceptPrivacy, setAcceptPrivacy] = useState(false);
	const [checkboxErrors, setCheckboxErrors] = useState<{
		terms?: string;
		privacy?: string;
	}>({});

	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();

	const readyToRender = stripe && elements && isAddressReady && isLinkAuthenticationReady && isPaymentReady;

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

		if (!stripe || !elements) {
			console.warn("Stripe or Elements not ready");
			return;
		}
		const shippingAddressElement = elements.getElement("address");

		if (!shippingAddressElement) {
			console.warn("Address Element expected to exist but not found");
			return;
		}

		try {
			const shippingAddressObject = await shippingAddressElement.getValue();
			const shippingAddress: Partial<AddressSchema> = {
				name: shippingAddressObject.value.name,
				city: shippingAddressObject.value.address.city,
				country: shippingAddressObject.value.address.country,
				line1: shippingAddressObject.value.address.line1,
				line2: shippingAddressObject.value.address.line2,
				postalCode: shippingAddressObject.value.address.postal_code,
				state: shippingAddressObject.value.address.state,
				phone: shippingAddressObject.value.phone,
			};

			const billingAddress: Partial<AddressSchema> = sameAsShipping ? shippingAddress : billingAddressValues;

			const validatedBillingAddress = addressSchema.safeParse(billingAddress);
			const validatedShippingAddress = addressSchema.safeParse(shippingAddress);

			// when billing address form is visible we display billing errors inline under fields
			if (!validatedBillingAddress.success && !sameAsShipping) {
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
			const inputTemplate = {
				channelId: channel,
				billingAddress: {
					city: billingAddressValues.city || "",
					cityArea: "",
					companyName: "",
					country: billingAddressValues.country ?? "",
					countryArea: "",
					firstName: billingAddressValues.name || "",
					lastName: "",
					phone: billingAddressValues.phone ?? "",
					postalCode: billingAddressValues.postalCode || "",
					streetAddress1: billingAddressValues.line1 || "",
					streetAddress2: billingAddressValues.line2 ?? "",
				},
				user: billingAddressValues.email ?? "",
				userEmail: billingAddressValues.email ?? "",
				lines: checkout?.lines.map((line) => ({ variantId: line.variant.id, quantity: line.quantity })) || [],
				shippingAddress: {
					city: shippingAddress.city || "",
					cityArea: "",
					companyName: "",
					country: shippingAddress.country ?? "",
					countryArea: "",
					firstName: shippingAddress.name || "",
					lastName: "",
					phone: shippingAddress.phone ?? "",
					postalCode: shippingAddress.postalCode || "",
					streetAddress1: shippingAddress.line1 || "",
					streetAddress2: shippingAddress.line2 ?? "",
				},
			};

			const createOrderInSaleor = await fetch("/api/saleor-create-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: inputTemplate }),
			});

			const result = await stripe.confirmPayment({
				elements,
				redirect: "if_required",
				confirmParams: {
					return_url: `${window.location.origin}/order/success`,
					payment_method_data: {
						billing_details: {
							name: validatedBillingAddress.data.name,
							phone: validatedBillingAddress.data.phone ?? "",
							address: {
								city: validatedBillingAddress.data.city,
								country: validatedBillingAddress.data.country,
								line1: validatedBillingAddress.data.line1,
								line2: validatedBillingAddress.data.line2 ?? "",
								postal_code: validatedBillingAddress.data.postalCode,
								state: validatedBillingAddress.data.state ?? "",
							},
						},
					},
					shipping: {
						name: validatedShippingAddress.data.name,
						phone: validatedShippingAddress.data.phone ?? "",
						address: {
							city: validatedShippingAddress.data.city,
							country: validatedShippingAddress.data.country,
							line1: validatedShippingAddress.data.line1,
							line2: validatedShippingAddress.data.line2 ?? "",
							postal_code: validatedShippingAddress.data.postalCode,
							state: validatedShippingAddress.data.state ?? "",
						},
					},
				},
			});

			if (result.error) {
				setIsLoading(false);
				setFormErrorMessage(result.error.message ?? t("unexpectedError"));
			} else {
				if (!createOrderInSaleor.ok) {
					setIsLoading(false);

					// Використовуємо statusText або отримуємо повідомлення з тіла відповіді
					const errorMessage = await createOrderInSaleor.text(); // або .json() якщо сервер повертає JSON
					setFormErrorMessage(errorMessage || t("unexpectedError"));
				}

				// clear cart cookie after successful payment for payment methods that do not require redirect
				// for payment methods that require redirect, we clear the cookie on the success page
				await clearCartCookieAction();
				const params = new URLSearchParams({
					payment_intent: result.paymentIntent.id,
					payment_intent_client_secret: result?.paymentIntent?.client_secret ?? "",
				});
				router.push("/order/success?" + params.toString());
				// deliberately not setting isLoading to false here to prevent the button to flicker back to "Pay now" before redirecting
				// setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			setFormErrorMessage(error instanceof Error ? error.message : t("unexpectedError"));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<LinkAuthenticationElement
				onChange={(e) => setBillingAddressValues((prev) => ({ ...prev, email: e.value.email }))}
				onReady={() => setIsLinkAuthenticationReady(true)}
			/>
			<AddressElement
				options={{
					mode: "shipping",
					fields: { phone: "always" },
					validation: { phone: { required: "auto" } },
				}}
				onChange={(e) => {
					// do not override billing address if it's manually edited
					if (!sameAsShipping) {
						return;
					}
					console.log(e.value, "shipping value");
					setBillingAddressValues((prev) => ({
						...prev,
						name: e.value.name,
						city: e.value.address.city,
						country: e.value.address.country,
						line1: e.value.address.line1,
						line2: e.value.address.line2 ?? null,
						postalCode: e.value.address.postal_code,
						state: e.value.address.state ?? null,
						phone: e.value.phone ?? null,
					}));
				}}
				onReady={() => setIsAddressReady(true)}
			/>

			{readyToRender && !allProductsDigital && (
				<ShippingRatesSection
					locale={locale}
					onChange={(value) => {
						transition(async () => {
							setShippingRateId(value);
							await saveShippingRateAction({ shippingRateId: value });
							await elements?.fetchUpdates();
							router.refresh();
						});
					}}
					value={shippingRateId}
					shippingRates={shippingRates}
				/>
			)}

			{readyToRender && (
				<div className="space-y-1">
					<Label className="flex flex-row items-center gap-x-2">
						<Checkbox
							onCheckedChange={(checked) => setAcceptTerms(checked === true)}
							checked={acceptTerms}
							name="acceptTerms"
							value={acceptTerms ? "true" : "false"}
							required
						/>
						<span>Akceptuję Regulamin i zgadzam się na zawarcie umowy sprzedaży.</span>
					</Label>
					{checkboxErrors.terms && <p className="text-sm text-red-500 pl-6">{checkboxErrors.terms}</p>}
				</div>
			)}

			{/* Required Privacy Policy Checkbox */}
			{readyToRender && (
				<div className="space-y-1">
					<Label className="flex flex-row items-center gap-x-2">
						<Checkbox
							onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
							checked={acceptPrivacy}
							name="acceptPrivacy"
							value={acceptPrivacy ? "true" : "false"}
							required
						/>
						<span>
							Zgadzam się na przetwarzanie moich danych osobowych w celu realizacji zamówienia zgodnie z
							Polityką Prywatności.
						</span>
					</Label>
					{checkboxErrors.privacy && <p className="text-sm text-red-500 pl-6">{checkboxErrors.privacy}</p>}
				</div>
			)}

			{readyToRender && (
				<Label
					className="flex flex-row items-center gap-x-2"
					aria-controls="billingAddressCollapsibleContent"
					aria-expanded={!sameAsShipping}
				>
					<Checkbox
						onCheckedChange={(checked) => {
							setSameAsShipping(checked === true);
						}}
						checked={sameAsShipping}
						name="sameAsShipping"
						value={sameAsShipping ? "true" : "false"}
					/>
					{t("billingSameAsShipping")}
				</Label>
			)}
			{/* Required Terms Checkbox */}

			{readyToRender && (
				<Collapsible className="" open={!sameAsShipping}>
					<CollapsibleContent id="billingAddressCollapsibleContent" className="CollapsibleContent">
						<fieldset
							aria-hidden={sameAsShipping}
							tabIndex={sameAsShipping ? -1 : undefined}
							className={`grid gap-6 rounded-lg border p-4`}
						>
							<legend className="-ml-1 whitespace-nowrap px-1 text-sm font-medium">
								{t("billingAddressTitle")}
							</legend>
							<BillingAddressSection
								values={billingAddressValues}
								onChange={setBillingAddressValues}
								errors={fieldErrors}
							/>
						</fieldset>
					</CollapsibleContent>
				</Collapsible>
			)}
			<PaymentElement
				onReady={() => setIsPaymentReady(true)}
				options={{
					fields: {
						billingDetails: {
							address: "never",
						},
					},
				}}
			/>

			{formErrorMessage && (
				<Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
					<AlertCircle className="-mt-1 h-4 w-4" />
					<AlertTitle>{t("errorTitle")}</AlertTitle>
					<AlertDescription>{formErrorMessage}</AlertDescription>
				</Alert>
			)}
			{readyToRender && (
				<Button
					type="submit"
					className="w-full rounded-full text-lg"
					size="lg"
					aria-disabled={isBillingAddressPending || isLoading || isTransitioning}
					onClick={(e) => {
						if (isBillingAddressPending || isLoading || isTransitioning) {
							e.preventDefault();
						}
					}}
				>
					{isBillingAddressPending || isLoading || isTransitioning ? (
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
			)}
		</form>
	);
};

const BillingAddressSection = ({
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
				// required
				label={t("fullName")}
				name="name"
				defaultValue={values.name ?? ""}
				autoComplete="shipping name"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("address1")}
				name="line1"
				defaultValue={values.line1 ?? ""}
				autoComplete="shipping address-line1"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				label={t("address2")}
				name="line2"
				defaultValue={values.line2 ?? ""}
				autoComplete="shipping address-line2"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<InputWithErrors
					// required
					label={t("postalCode")}
					name="postalCode"
					defaultValue={values.postalCode ?? ""}
					autoComplete="shipping postal-code"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<InputWithErrors
					// required
					label={t("city")}
					name="city"
					defaultValue={values.city ?? ""}
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
					defaultValue={values.state ?? ""}
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
				// required
				label={t("phone")}
				name="phone"
				defaultValue={values.phone ?? ""}
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
				defaultValue={values.taxId ?? ""}
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
