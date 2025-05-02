import type { CheckoutLine } from "@/gql/graphql";

const QuantityChanges = ({
	onMinus,
	onPlus,
	line,
}: { line: CheckoutLine; onMinus: () => Promise<void>; onPlus: () => Promise<void> }) => {
	return (
		<div
			style={{ border: "1px solid #000", background: "rgb(234,234,234)" }}
			className="border-2 max-w-[110px]  rounded-[5px] max-h-[27px] overflow-hidden flex items-center  "
		>
			<button
				onClick={onMinus}
				disabled={line.quantity === 1}
				style={{ borderRight: " 1px solid #000" }}
				className="text-[1.5rem] disabled:cursor-not-allowed hover:cursor-pointer flex items-center justify-center outline-none h-[27px] p-[0rem_0.7rem] "
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-[10x] h-[13px] "
					viewBox="0 0 448 512"
					fill="currentColor"
				>
					<path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path>
				</svg>
			</button>
			<input
				style={{ background: "rgb(234,234,234)" }}
				type="number"
				className="border-none max-w-10 text-center p-[0.4rem] "
				value={line.quantity}
				onChange={(e) => {
					console.log(e);
				}}
			/>
			<button
				onClick={onPlus}
				style={{ borderLeft: " 1px solid #000" }}
				className="text-[1.5rem] disabled:cursor-not-allowed hover:cursor-pointer flex items-center justify-center outline-none h-[27px] p-[0rem_0.7rem] "
			>
				<svg
					className="w-[10x] h-[13px]"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					fill="currentColor"
				>
					<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
				</svg>
			</button>
		</div>
	);
};
export default QuantityChanges;
