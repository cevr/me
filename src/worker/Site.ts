import * as Cloudflare from "@alchemy.run/cloudflare";
import { Stage } from "alchemy/Stage";
import { Effect, Option } from "effect";
import { HttpServerRequest } from "effect/http";
import { createRequestHandler } from "react-router";

import * as build from "#server-build";

import { respond } from "../server/render.ts";

export const DOMAIN = "cvr.im";

const ASSETS = {
  directory: "build/client",
  htmlHandling: "drop-trailing-slash",
  notFoundHandling: "none",
} as const;

const props = Effect.gen(function* () {
  const stage = yield* Effect.serviceOption(Stage);
  const base = { main: import.meta.url, assets: ASSETS };
  if (!Option.contains(stage, "prod")) return base;
  return { ...base, name: "me", workersDev: false, domain: DOMAIN };
});

export default class Site extends Cloudflare.Worker<Site>()(
  "Site",
  props,
  Effect.sync(() => {
    const handle = createRequestHandler(build, "production");
    return {
      fetch: Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest;
        return yield* respond(handle, request);
      }),
    };
  }),
) {}
