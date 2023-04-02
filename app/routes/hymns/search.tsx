import type { LoaderArgs } from "@remix-run/node";
import { matchSorter } from "match-sorter";

import { getHymns } from "~/lib/hymns.server";

export let loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  if (!query) {
    return [];
  }

  const hymns = await getHymns("number");
  const filteredHymns = matchSorter(Object.values(hymns), query, {
    keys: ["title", "number"],
  });

  return filteredHymns.slice(0, 9);
};
