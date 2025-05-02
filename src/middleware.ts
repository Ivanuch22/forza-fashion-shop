import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales } from "./i18n";

export default createMiddleware({
	defaultLocale,
	locales,
	localePrefix,
	localeDetection: false,
});

export const config = {
	matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

// import { NextResponse, type NextRequest } from "next/server";
// import createIntlMiddleware from "next-intl/middleware";
// import { locales, localePrefix, defaultLocale } from "@/i18n";

// // Create the internationalization middleware
// const intlMiddleware = createIntlMiddleware({
//   defaultLocale,
//   locales,
//   localePrefix,
//   localeDetection: false,
// });

// export function middleware(request: NextRequest) {
//   // Check if the path is for static files
//   if (request.nextUrl.pathname.startsWith("/_next/static/")) {
//     const response = NextResponse.next();
//     response.headers.set(
//       "Cache-Control",
//       "public, max-age=31536000, immutable"
//     );
//     return response;
//   }

//   // For all other routes, use the internationalization middleware
//   return intlMiddleware(request);
// }

// export const config = {
//   // Matcher configured to ignore static files, api routes, etc.
//   // but handle everything else
//   matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
// };
