import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { cacheHeader } from "pretty-cache-header";

import { getFilteredHymns } from "~/lib/hymns.server";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  return json(await getFilteredHymns(request), {
    headers: {
      "cache-control": cacheHeader({
        public: true,
        maxAge: "1week",
        staleWhileRevalidate: "1year",
      }),
    },
  });
};
