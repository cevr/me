/**
 * cvr.im on Cloudflare: one Worker with the client build as its static assets.
 *
 * Requests are served assets-first: a path that names a prerendered page, a
 * feed or a hashed file never invokes the Worker. Everything else reaches
 * `fetch`, which hands it to React Router (`../server/render.ts`).
 *
 * `prod` takes the Worker name `me` and the `cvr.im` custom domain, and turns
 * its `workers.dev` host off. Any other stage is a throwaway copy on a
 * generated `workers.dev` name and never touches the domain.
 */
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

/** The props, by stage. The running Worker reads them without one. */
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
