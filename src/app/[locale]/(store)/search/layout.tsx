export default async function CategoryLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<main className="mx-auto px-4 sm:px-6 lg:px-8 flex w-full flex-1 flex-col  pb-6">{children}</main>
		</>
	);
}
