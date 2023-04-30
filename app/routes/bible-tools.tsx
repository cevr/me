import * as React from "react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/button";
import { Input } from "~/components/input";

type EmbeddingSource = {
  source: string;
  label: string;
};

export let meta: MetaFunction = () => ({
  title: "Bible study tools",
});

export let loader = async ({ request }: LoaderArgs) => {
  const query = new URL(request.url).searchParams.get("query") ?? "";
  if (!query)
    return defer({
      data: {
        answer: "",
        egw: [] as EmbeddingSource[],
        bible: [] as EmbeddingSource[],
      },
    });
  const result = fetch(`https://bible-tools-api-production.up.railway.app/search?q=${query}`).then(
    (res) =>
      res.json() as Promise<{
        egw: EmbeddingSource[];
        bible: EmbeddingSource[];
        answer: string;
      }>,
  );

  return defer({ result });
};

export default function EgwSearchPage() {
  let fetcher = useFetcher<{
    result: {
      answer: string;
      egw: EmbeddingSource[];
      bible: EmbeddingSource[];
    };
  }>();

  console.log(fetcher.data);

  return (
    <main className="flex flex-col h-full gap-4 justify-between h-min-0">
      <div className="flex flex-col gap-2 h-full overflow-y-auto scrollbar-hide">
        {fetcher.data && (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Answer</h2>
              <p>{fetcher.data.result.answer}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Bible results</h2>
              <ul className="flex flex-col gap-2">
                {fetcher.data.result.bible.map((result) => (
                  <li key={result.label} className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-300 font-mono">{result.label}</span>
                    <span>{result.source}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">EGW results</h2>
              <ul className="flex flex-col gap-2">
                {fetcher.data.result.egw.map((result) => (
                  <li key={result.label} className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-300 font-mono">{result.label}</span>
                    <span>{result.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <fetcher.Form method="GET" className="flex gap-2">
        <Input type="text" name="query" placeholder="Study the bible" autoComplete="off" />
        <Button type="submit">{fetcher.state !== "idle" ? "Loading..." : "Search"}</Button>
      </fetcher.Form>
    </main>
  );
}
