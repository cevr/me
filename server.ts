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

    // SSR — cache at CDN edge, revalidate in background
    let response: Response;
    try {
      response = await handler(req);
    } catch {
      return new Response("Not Found", { status: 404 });
    }

    if (response.status === 200 && !response.headers.has("cache-control")) {
      const isRSS = pathname.endsWith("/rss.xml");
      const isSitemap = pathname === "/sitemap.xml";

      if (isRSS || isSitemap) {
        response.headers.set(
          "cache-control",
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
        );
      } else {
        response.headers.set(
          "cache-control",
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        );
      }
    }

    return response;
  },
  error() {
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
