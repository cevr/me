import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import ReactDOMServer from "react-dom/server";

import { getBibleEmbeddings, getEgwEmbeddings } from "./lib/bible-tools.server";

require("dotenv").config();

// Preload the embeddings
getBibleEmbeddings();
getEgwEmbeddings();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let markup = ReactDOMServer.renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
