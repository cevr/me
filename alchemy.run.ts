/**
 * cvr.im, declared as an Alchemy stack: one Cloudflare Worker serving the
 * React Router build (`src/worker/Site.ts`).
 *
 * `bun run deploy` builds and deploys `prod`. Any other stage is a throwaway
 * copy (`bunx alchemy deploy alchemy.run.ts --stage <name>`), destroyed with
 * `bunx alchemy destroy alchemy.run.ts --stage <name>`.
 *
 * State lives in the Cloudflare state store, so every machine and CI see the
 * same resources.
 */
import * as Alchemy from "alchemy";
import * as Cloudflare from "@alchemy.run/cloudflare";
import { Effect } from "effect";

import Site from "./src/worker/Site.ts";

export const providers = Cloudflare.providers();

export default Alchemy.Stack(
  "me",
  { providers, state: Cloudflare.state() },
  Effect.gen(function* () {
    const site = yield* Site;
    return { url: site.url };
  }),
);
