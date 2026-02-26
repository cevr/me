import { createRequestHandler } from "react-router";

const MODE = process.env.NODE_ENV ?? "production";
const BUILD_PATH = "./build/server/index.js";
const CLIENT_PATH = "./build/client";

const build = await import(BUILD_PATH);
const handler = createRequestHandler(build, MODE);

Bun.serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    // Hashed assets — immutable cache
    if (pathname.startsWith("/assets/")) {
      const file = Bun.file(`${CLIENT_PATH}${pathname}`);
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Static files from client build (favicon, etc.)
    const staticFile = Bun.file(`${CLIENT_PATH}${pathname}`);
    if (pathname !== "/" && (await staticFile.exists())) {
      return new Response(staticFile, {
        headers: { "cache-control": "public, max-age=3600" },
      });
    }

    // React Router handles everything else
    return handler(req);
  },
});

console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
