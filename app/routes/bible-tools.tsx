import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { Button } from "~/components/button";
import { Input } from "~/components/input";

type LabeledEmbedding = {
  label: string;
  source: string;
  embedding: number[];
};

export let meta: MetaFunction = () => ({
  title: "Bible study tools",
});

export default function EgwSearchPage() {
  let fetcher = useFetcher<{
    answer: string;
    egw: Omit<LabeledEmbedding, "embedding">[];
    bible: Omit<LabeledEmbedding, "embedding">[];
  }>();
  return (
    <main className="flex flex-col h-full gap-4 justify-center h-min-0">
      <fetcher.Form method="GET" action="/bible-tools/search" className="flex gap-2">
        <Input type="text" name="query" placeholder="Study the bible" />
        <Button type="submit">{fetcher.state !== "idle" ? "Loading..." : "Search"}</Button>
      </fetcher.Form>

      {fetcher.data && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Answer</h2>
            <p>{fetcher.data.answer}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Bible results</h2>
            <ul className="flex flex-col gap-2">
              {fetcher.data.bible.map((result) => (
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
              {fetcher.data.egw.map((result) => (
                <li key={result.label} className="flex flex-col gap-1">
                  <span className="text-sm text-neutral-300 font-mono">{result.label}</span>
                  <span>{result.source}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
