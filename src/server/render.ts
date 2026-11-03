import { Effect } from "effect";
import { Headers, HttpServerRequest, HttpServerResponse } from "effect/http";

export type Handle = (request: Request) => Promise<Response>;

export const CACHE = {
  feed: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
  page: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

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
  const response = yield* Effect.promise(() => handle(web));
  return withPolicy(new URL(web.url).pathname, HttpServerResponse.fromWeb(response));
});

export const respond = (handle: Handle, request: HttpServerRequest.HttpServerRequest) =>
  render(handle, request).pipe(
    Effect.catchTag(["RequestParseError", "RouteNotFound", "InternalError"], () =>
      Effect.succeed(HttpServerResponse.empty({ status: 400 })),
    ),
  );
