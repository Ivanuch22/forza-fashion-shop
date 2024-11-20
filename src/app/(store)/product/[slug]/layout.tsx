export default async function CategoryLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<>
			<main className="mx-auto flex w-full flex-1 flex-col  pb-6 pt-2 ">{children}</main>
		</>
	);
}
