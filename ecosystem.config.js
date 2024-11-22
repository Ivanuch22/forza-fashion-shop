module.exports = {
	apps: [
		{
			name: "next-app",
			script: "pnpm",
			args: "start",
			cwd: "/",
			watch: true,
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
