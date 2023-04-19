import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

type EmbeddingSource = {
  source: string;
  label: string;
};

export let loader = async ({ request }: LoaderArgs) => {
  const query = new URL(request.url).searchParams.get("query") ?? "";
  if (!query) throw new Error("No query provided");
  const result = await fetch(`https://bible-tools-api-production.up.railway.app/search?q=${query}`).then(
    (res) =>
      res.json() as Promise<{
        egw: EmbeddingSource[];
        bible: EmbeddingSource[];
        answer: string;
      }>,
  );

  return json(result);
};
