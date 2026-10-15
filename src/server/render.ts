/**
 * A page the static files do not answer, rendered by React Router.
 *
 * Every route is prerendered, so Cloudflare's asset layer answers the pages,
 * feeds and hashed files before the Worker runs (`public/_headers` sets their
 * caching). The Worker sees only what no file matches: an unknown path, which
 * React Router answers with the not-found page and a 404.
 *
 * A rendered 200 without its own policy is cached at the edge: the sitemap and
 * the feed for a day, a page for an hour, both revalidated in the background.
 */
import { Effect } from "effect";
import { Headers, HttpServerRequest, HttpServerResponse } from "effect/http";

/** React Router's request handler, as `createRequestHandler` returns it. */
export type Handle = (request: Request) => Promise<Response>;

export const CACHE = {
  feed: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
  page: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

/** The edge policy for a rendered 200, by what the path names. */
export const cacheControl = (pathname: string): string => {
  if (pathname === "/sitemap.xml" || pathname.endsWith("/rss.xml")) return CACHE.feed;
  return CACHE.page;
};

const withPolicy = (pathname: string, response: HttpServerResponse.HttpServerResponse) => {
  if (response.status !== 200 || Headers.has(response.headers, "cache-control")) return response;
  return HttpServerResponse.setHeader(response, "cache-control", cacheControl(pathname));
};

export const render = Effect.fn("Site.render")(function* (
  handle: Handle,
  request: HttpServerRequest.HttpServerRequest,
) {
  const web = yield* HttpServerRequest.toWeb(request);
  // React Router answers every request it is handed, errors included, so a
  // rejected promise is a defect, not an expected failure.
  const response = yield* Effect.promise(() => handle(web));
  return withPolicy(new URL(web.url).pathname, HttpServerResponse.fromWeb(response));
});

/** `render`, with a request the host cannot hand to React Router answered 400. */
export const respond = (handle: Handle, request: HttpServerRequest.HttpServerRequest) =>
  render(handle, request).pipe(
    Effect.catchTag(["RequestParseError", "RouteNotFound", "InternalError"], () =>
      Effect.succeed(HttpServerResponse.empty({ status: 400 })),
    ),
  );
