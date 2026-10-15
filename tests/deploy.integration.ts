/**
 * The deploy, checked against real Cloudflare: a throwaway `test_$USER` stage
 * is deployed, probed and destroyed in one scope, so a failure destroys it too.
 *
 * Outside the gate's test folder pattern on purpose, so the gate never
 * deploys. Run it with `bun run test:deploy` (it builds first) before handing
 * off a change to the stack, the Worker, or the Alchemy or Effect versions.
 */
import { expect } from "bun:test";
import * as Test from "alchemy/Test/Bun";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect, Option, Schedule } from "effect";
import { HttpClient } from "effect/http";

import Stack, { providers } from "../alchemy.run.ts";

const { test, deploy, destroy } = Test.make({ providers, state: Cloudflare.state() });

const deployed = Effect.acquireRelease(deploy(Stack), () => destroy(Stack).pipe(Effect.orDie));

test(
  "the site serves its pages, assets and not-found page from Cloudflare",
  Effect.gen(function* () {
    const outputs = yield* deployed;
    const url = yield* Effect.fromOption(Option.fromNullishOr(outputs.url));
    const raw = yield* HttpClient.HttpClient;
    const client = raw.pipe(HttpClient.filterStatusOk);
    // A fresh workers.dev host can answer 404 for a few seconds after deploy.
    const get = (path: string) =>
      client
        .get(`${url}${path}`)
        .pipe(Effect.retry({ schedule: Schedule.exponential("1 second"), times: 8 }));

    const home = yield* get("/");
    const html = yield* home.text;
    expect(html).toContain("building things with care");

    const blog = yield* get("/blog");
    expect(blog.headers["content-type"]).toContain("text/html");

    const sitemap = yield* get("/sitemap.xml");
    expect(yield* sitemap.text).toContain("<urlset");

    const asset = /\/assets\/[^"]+\.css/.exec(html)?.[0] ?? "/missing.css";
    const css = yield* get(asset);
    expect(css.headers["cache-control"]).toBe("public, max-age=31536000, immutable");

    const missing = yield* raw.get(`${url}/nope`);
    expect(missing.status).toBe(404);
    expect(yield* missing.text).toContain("not found");
  }).pipe(Effect.scoped),
  { timeout: 600_000 },
);
