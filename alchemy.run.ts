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
