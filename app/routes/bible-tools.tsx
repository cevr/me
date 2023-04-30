import * as React from "react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";

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
      result: {
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
  const [params] = useSearchParams();
  const queryExists = params.has("query");
  const formState = useNavigation();

  let data = useLoaderData<typeof loader>();

  const loading = formState.state !== "idle";

  return (
    <main className="flex flex-col h-full gap-4 justify-between h-min-0">
      <div className="flex flex-col gap-2 h-full overflow-y-auto scrollbar-hide">
        <React.Suspense fallback={null}>
          <Await resolve={data.result}>
            {(data) =>
              queryExists ? (
                <>
                  <div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-2xl">Answer</h2>
                      <p>{data.answer}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-2xl">Bible results</h2>
                      <ul className="flex flex-col gap-2">
                        {data.bible.map((result) => (
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
                        {data.egw.map((result) => (
                          <li key={result.label} className="flex flex-col gap-1">
                            <span className="text-sm text-neutral-300 font-mono">{result.label}</span>
                            <span>{result.source}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : null
            }
          </Await>
        </React.Suspense>
      </div>

      <Form method="GET" className="flex gap-2">
        <Input type="text" name="query" placeholder="Study the bible" autoComplete="off" />
        <Button type="submit">{loading ? "Loading..." : "Search"}</Button>
      </Form>
    </main>
  );
}
