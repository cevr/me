// The Worker's render policy, against React Router's real production build:
// what reaches the Worker is a path no static file answers.

import { Effect } from "effect";
import { HttpServerRequest } from "effect/http";
import { test } from "bun:test";
import { describe, expect, it } from "effect-bun-test";
import { createRequestHandler } from "react-router";

import * as build from "#server-build";

import { CACHE, cacheControl, respond } from "../src/server/render.ts";

const handle = createRequestHandler(build, "production");

const get = (path: string) =>
  respond(handle, HttpServerRequest.fromWeb(new Request(`https://cvr.im${path}`)));

describe("render", () => {
  it.effect("an unknown path renders the not-found page as a 404", () =>
    Effect.gen(function* () {
      const response = yield* get("/nope");
      expect(response.status).toBe(404);
      expect(response.headers["content-type"]).toContain("text/html");
      expect(response.headers["cache-control"]).toBeUndefined();
    }),
  );

  it.effect("a rendered page is cached at the edge for an hour", () =>
    Effect.gen(function* () {
      const response = yield* get("/");
      expect(response.status).toBe(200);
      expect(response.headers["cache-control"]).toBe(CACHE.page);
    }),
  );

  test("the sitemap and the feed are cached for a day", () => {
    expect(cacheControl("/sitemap.xml")).toBe(CACHE.feed);
    expect(cacheControl("/blog/rss.xml")).toBe(CACHE.feed);
    expect(cacheControl("/blog")).toBe(CACHE.page);
  });
});
