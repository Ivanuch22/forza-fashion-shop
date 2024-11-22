"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.trieve = void 0;
var graphql_1 = require("@/gql/graphql");
var graphql_2 = require("@/lib/graphql");
var env_1 = require("@next/env");
var trieve_ts_sdk_1 = require("trieve-ts-sdk");
env_1.default.loadEnvConfig(".");
var env = (await Promise.resolve().then(function () { return require("@/env.mjs"); })).env;
var datasetId = env.TRIEVE_DATASET_ID;
var apiKey = env.TRIEVE_API_KEY;
if (!datasetId || !apiKey) {
    console.error("Missing TRIEVE_API_KEY or TRIEVE_DATASET_ID");
    process.exit(1);
}
exports.trieve = new trieve_ts_sdk_1.TrieveSDK({ apiKey: apiKey, datasetId: datasetId });
// Замість Stripe тепер отримуємо продукти з Saleor
var getAllProducts = await (0, graphql_2.executeGraphQL)(graphql_1.UploadTrieveProductsListDocument, { variables: { first: 500 }, revalidate: 60 });
var products = (_b = (_a = getAllProducts.products) === null || _a === void 0 ? void 0 : _a.edges) !== null && _b !== void 0 ? _b : [];
var chunks = products.flatMap(function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var product = _a.node;
    if (!((_e = (_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.pricing) === null || _b === void 0 ? void 0 : _b.priceRange) === null || _c === void 0 ? void 0 : _c.start) === null || _d === void 0 ? void 0 : _d.gross) === null || _e === void 0 ? void 0 : _e.amount)) {
        return [];
    }
    var link = ((_f = product === null || product === void 0 ? void 0 : product.variants) === null || _f === void 0 ? void 0 : _f[0])
        ? "/product/".concat(product === null || product === void 0 ? void 0 : product.slug, "?variant=").concat((_g = product === null || product === void 0 ? void 0 : product.variants[0]) === null || _g === void 0 ? void 0 : _g.id)
        : "/product/".concat(product === null || product === void 0 ? void 0 : product.slug);
    return {
        chunk_html: "\nProduct Name: ".concat(product === null || product === void 0 ? void 0 : product.name, "\n\nDescription: ").concat(product === null || product === void 0 ? void 0 : product.description, "\n").trim(),
        image_urls: (_j = (_h = product === null || product === void 0 ? void 0 : product.media) === null || _h === void 0 ? void 0 : _h.map(function (media) { return media.url; })) !== null && _j !== void 0 ? _j : [],
        tracking_id: product === null || product === void 0 ? void 0 : product.id,
        upsert_by_tracking_id: true,
        link: link,
        metadata: {
            name: product === null || product === void 0 ? void 0 : product.name,
            description: (product === null || product === void 0 ? void 0 : product.description) || "",
            slug: product === null || product === void 0 ? void 0 : product.slug,
            image_url: (_l = (_k = product === null || product === void 0 ? void 0 : product.media) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.url,
            amount: (_p = (_o = (_m = product === null || product === void 0 ? void 0 : product.pricing) === null || _m === void 0 ? void 0 : _m.priceRange) === null || _o === void 0 ? void 0 : _o.start) === null || _p === void 0 ? void 0 : _p.gross.amount,
            currency: (_s = (_r = (_q = product === null || product === void 0 ? void 0 : product.pricing) === null || _q === void 0 ? void 0 : _q.priceRange) === null || _r === void 0 ? void 0 : _r.start) === null || _s === void 0 ? void 0 : _s.gross.currency,
        },
    };
});
var r = await exports.trieve.createChunk(chunks);
console.log("Done", r);
// import { ProductListDocument } from "@/gql/graphql";
// import { executeGraphQL } from "@/lib/graphql";
// import NextEnv from "@next/env";
// import * as Commerce from "commerce-kit";
// import { mapProducts } from "commerce-kit/internal";
// import { type ChunkReqPayload, TrieveSDK } from "trieve-ts-sdk";
// NextEnv.loadEnvConfig(".");
// const { env } = await import("@/env.mjs");
// const datasetId = env.TRIEVE_DATASET_ID;
// const apiKey = env.TRIEVE_API_KEY;
// if (!datasetId || !apiKey) {
// 	console.error("Missing TRIEVE_API_KEY or TRIEVE_DATASET_ID");
// 	process.exit(1);
// }
// export const trieve = new TrieveSDK({ apiKey, datasetId });
// const stripe = Commerce.provider({
// 	secretKey: env.STRIPE_SECRET_KEY,
// 	tagPrefix: undefined,
// });
// const data = await stripe.products.list({
// 	limit: 100,
// 	active: true,
// 	expand: ["data.default_price"],
// });
// const getAllProducts = await executeGraphQL(ProductListDocument, { variables: { first: 500 }, revalidate: 60 })
// const products = getAllProducts.products?.edges
// const chunks = mapProducts(data).flatMap((product): ChunkReqPayload | ChunkReqPayload[] => {
// 	if (!product?.default_price.unit_amount) {
// 		return [];
// 	}
// 	const link = product?.metadata.variant
// 		? `/product/${product?.metadata.slug}?variant=${product?.metadata.variant}`
// 		: `/product/${product?.metadata.slug}`;
// 	return {
// 		chunk_html: `
// Product Name: ${product?.name}
// Description: ${product?.description}
// `.trim(),
// 		image_urls: product?.images,
// 		tracking_id: product?.id,
// 		upsert_by_tracking_id: true,
// 		link,
// 		metadata: {
// 			name: product?.name,
// 			description: product?.description,
// 			slug: product?.metadata.slug,
// 			image_url: product?.images[0],
// 			amount: product.default_price.unit_amount,
// 			currency: product.default_price.currency,
// 		} satisfies TrieveProductMetadata,
// 	};
// });
// const r = await trieve.createChunk(chunks);
// console.log("Done", r);
// export type TrieveProductMetadata = {
// 	name: string;
// 	description: string | null;
// 	slug: string;
// 	image_url: string | undefined;
// 	amount: number;
// 	currency: string;
// };
