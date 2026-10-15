// Server rendering on the Worker: React's Web Streams renderer, since the
// Worker has no Node streams. Crawlers get the whole document at once.
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  let statusCode = responseStatusCode;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), streamTimeout + 1_000);
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        statusCode = 500;
        console.error(error);
      },
    },
  );
  body.allReady.then(() => clearTimeout(timeout));
  if (isbot(request.headers.get("user-agent") ?? "") || routerContext.isSpaMode) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, { headers: responseHeaders, status: statusCode });
}
