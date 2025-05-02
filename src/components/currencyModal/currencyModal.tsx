"use client";
import React, { useState } from "react";
import "./style.css";
import { updateCurrency } from "@/actions/channel-actions";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface ICurrencyModal {
	channel: string | null | undefined;
	channels: {
		channel: string;
		currency: string;
	}[];
}

const CurrencyModal = ({ channel, channels }: ICurrencyModal) => {
	const [open, setOpen] = useState(false);
	const [isShow, setShow] = useState(false);
	const [value, setValue] = useState({
		channel: "default-channel",
		currency: "USD",
	});

	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();

	const handleSubmit = async () => {
		await updateCurrency(value.channel, value.currency);

		// Switch language based on currency
		const newLocale = value.currency === "PLN" ? "pl" : "en";

		// Only redirect if the locale is different from current
		if (newLocale !== locale) {
			// Extract the path without the locale prefix
			let path = pathname;
			if (pathname.startsWith(`/${locale}`)) {
				path = pathname.substring(locale.length + 1);
			}

			// Redirect to the new locale path
			router.push(`/${newLocale}${path}`);
		}

		setShow(false);
	};

	// useEffect(() => {
	// 	if (channel !== "undefined") {
	// 		const findChannel = channels.find((element) => element.channel === channel) || {
	// 			channel: "default-channel",
	// 			currency: "USD",
	// 		};
	// 		setValue(findChannel);
	// 	}

	// 	if (channel == "undefined" || !channel) {
	// 		setShow(true);
	// 	}

	// 	// First load handling
	// 	if (locale === "pl" && value.currency !== "PLN") {
	// 		// If URL has "pl" locale but currency is not PLN, update to PLN
	// 		const plnChannel = channels.find(ch => ch.currency === "PLN");
	// 		if (plnChannel) {
	// 			setValue(plnChannel);
	// 			updateCurrency(plnChannel.channel, "PLN");
	// 		}
	// 	}
	// }, [channel, locale]);

	return (
		<>
			<div
				onClick={() => setShow(true)}
				className="flex text-center items-center hover: zIndex-3 text-[18px] hover:cursor-pointer"
			>
				{channels.map((chanel, index, array) => (
					<div key={`${index}-${chanel.channel}`}>
						{chanel?.currency}
						{index !== array.length - 1 && "/"}
					</div>
				))}
			</div>
			{isShow && (
				<div id="modal-root">
					<div className="sc-dAbbOL gDybZx">
						<div className="sc-fPXMVe iqosNg modal-content">
							<button onClick={() => setShow(false)} className="sc-feUZmu eBZdbK">
								<svg viewBox="0 0 19 19" fill="#000000">
									<path
										clipRule="evenodd"
										d="M1.808 1.806a1.25 1.25 0 011.767 0l13.789 13.788a1.25 1.25 0 01-1.768 1.768L1.808 3.574a1.25 1.25 0 010-1.768z"
									></path>
									<path
										clipRule="evenodd"
										d="M17.364 1.806a1.25 1.25 0 00-1.767 0L1.808 15.594a1.25 1.25 0 001.768 1.768L17.364 3.574a1.25 1.25 0 000-1.768z"
									></path>
								</svg>
							</button>
							<div className="sc-bdOgaJ dsCfhL">
								<h2 className="sc-empnci fwHrss">Currency Language Preferences</h2>
								<label className="sc-fThUAz cwyZjf">View currency in</label>
								<div className="sc-czkgLR drllRK">
									<div className=" css-58o6oo-container">
										<span
											aria-live="polite"
											aria-atomic="false"
											aria-relevant="additions text"
											className="css-7pg0cj-a11yText"
										></span>
										<div className="react-select__control css-17qp8uo-control">
											<div
												onClick={() => setOpen(true)}
												className="react-select__value-container react-select__value-container--has-value css-znz1z0"
											>
												<div className="react-select__single-value css-neqgbd-singleValue">
													{value?.currency}
												</div>
											</div>
											<div className="react-select__indicators css-1wy0on6">
												<span className="react-select__indicator-separator css-1ut02ty-indicatorSeparator"></span>
												<div
													className="react-select__indicator react-select__dropdown-indicator css-1p76wgi-indicatorContainer"
													aria-hidden="true"
												>
													<svg
														height="20"
														width="20"
														viewBox="0 0 20 20"
														aria-hidden="true"
														focusable="false"
														className="css-8mmkcg"
													>
														<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
													</svg>
												</div>
											</div>
										</div>
										{open && (
											<div className="border border-solid border-black">
												{channels.map((element) => (
													<div
														key={`${element?.channel}${element?.currency}`}
														onClick={() => {
															setOpen(false);
															setValue(element);
														}}
														className="p-[5px_10px] hover:bg-black hover:text-white hover:cursor-pointer"
													>
														{element?.currency}
													</div>
												))}
											</div>
										)}
									</div>
								</div>
								<button className="sc-iGgWBj hbmJCW" onClick={handleSubmit}>
									<span className="sc-kAyceB eDIMmw">Submit</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CurrencyModal;
