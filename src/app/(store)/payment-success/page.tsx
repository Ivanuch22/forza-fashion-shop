export default function PaymentSuccess({ searchParams }: { searchParams: { amount: string } }) {
	return (
		<main>
			<h1>thank you!</h1>
			<div>amount ${searchParams.amount}</div>
		</main>
	);
}
