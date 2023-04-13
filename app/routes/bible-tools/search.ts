import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { searchEmbeddings } from "~/lib/bible-tools.server";

export let loader = async ({ request }: LoaderArgs) => {
  const query = new URL(request.url).searchParams.get("query") ?? "";
  if (!query) throw new Error("No query provided");
  const result = await searchEmbeddings(query, 5);
  return json(result);
};
