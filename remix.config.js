// const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [
    "remark-gfm",
    /micromark-.*/,
    /mdast-.*/,
    "ccount",
    /unist-.*/,
    "decode-named-character-reference",
    "character-entities",
    "markdown-table",
  ],
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: [".*"],
  tailwind: true,
  future: {
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_errorBoundary: true,
  },
};
