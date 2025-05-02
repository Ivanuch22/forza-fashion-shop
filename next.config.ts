import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next/types";
const withNextIntl = createNextIntlPlugin();
// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   output: undefined,
//   logging: {
//     fetches: {
//       fullUrl: true,
//     },
//   },
//   images: {
//     remotePatterns: [
//       { hostname: "files.stripe.com" },
//       { hostname: "d1wqzb5bdbcre6.cloudfront.net" },
//       { hostname: "*.blob.vercel-storage.com" },
//       { hostname: "store-xe5dvtak.eu.saleor.cloud" },
//       { hostname: "picsum.photos" },
//     ],
//     formats: ["image/avif", "image/webp"],
//   },
//   transpilePackages: ["next-mdx-remote", "commerce-kit"],
//   experimental: {
//     esmExternals: true,
//     scrollRestoration: true,
//     ppr: true,
//     after: true,
//     cpus: 1,
//     reactOwnerStack: true,
//     reactCompiler: true,
//     mdxRs: true,
//   },
//   webpack: (config) => {
//     return {
//       ...config,

//       resolve: {
//         ...config.resolve,
//         alias: {
//           ...config.resolve.alias,
//           "@": path.resolve(__dirname, "src"),
//           "@ui": path.resolve(__dirname, "src/ui"),
//         },
//         extensionAlias: {
//           ".js": [".js", ".ts"],
//           ".jsx": [".jsx", ".tsx"],
//         },
//       },
//     };
//   },
//   rewrites: async () => [
//     {
//       source: "/stats/:match*",
//       destination: "https://eu.umami.is/:match*",
//     },
//   ],
// };

// export default withNextIntl(nextConfig);

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
				],
			},
		];
	},
	output: process.env.DOCKER ? "standalone" : undefined,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{ hostname: "files.stripe.com" },
			{ hostname: "d1wqzb5bdbcre6.cloudfront.net" },
			{ hostname: "*.blob.vercel-storage.com" },
			{ hostname: "store-xe5dvtak.eu.saleor.cloud" },
			{ hostname: "picsum.photos" },
		],
		formats: ["image/avif", "image/webp"],
	},
};

export default withNextIntl(nextConfig);
