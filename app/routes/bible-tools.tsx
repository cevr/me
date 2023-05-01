import * as React from "react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Form, Link, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";

import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { explore, searchAndChat } from "~/lib/bible-tools.server";

export let meta: MetaFunction = () => ({
  title: "Bible study tools",
});

export let loader = async ({ request }: LoaderArgs) => {
  const query = new URL(request.url).searchParams.get("query") ?? "";
  if (!query) return null;

  const result = searchAndChat(query).unwrap();

  return defer({ result: result, explore: result.then((res) => explore(res).unwrap()) });
};

export default function EgwSearchPage() {
  const [params] = useSearchParams();
  const query = params.get("query");
  const formState = useNavigation();

  let data = useLoaderData<typeof loader>();

  const loading = formState.state !== "idle";

  return (
    <main className="flex flex-col h-full gap-4 justify-between h-min-0">
      <div className="flex flex-col gap-2 h-full overflow-y-auto scrollbar-hide">
        {query ? (
          <React.Suspense fallback={null}>
            <Await resolve={data?.result}>
              {(data) => (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl">Answer</h2>
                    <p>{data!.answer}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {data?.bible.length ? (
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xs uppercase">Bible</h2>
                        <ul className="flex gap-2">
                          {data!.bible.map((result) => (
                            <li key={result.label} className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-sm text-neutral-300 font-mono flex-shrink-0"
                              >
                                {result.label}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {data?.egw.length ? (
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xs uppercase">EGW</h2>
                        <ul className="flex gap-2 flex-wrap">
                          {data!.egw.map((result) => (
                            <li key={result.label} className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-sm text-neutral-300 font-mono flex-shrink-0"
                              >
                                {result.label}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </Await>
          </React.Suspense>
        ) : null}
      </div>

      {query ? (
        <React.Suspense fallback={null}>
          <Await resolve={data?.explore}>
            {(data) => (
              <div className="flex gap-1 flex-col">
                {data?.explore.map((question) => (
                  <Link
                    to={{
                      search: new URLSearchParams({ query: question }).toString(),
                    }}
                    className={Button.variants({ variant: "outline", size: "sm" })}
                    key={question}
                  >
                    {question}
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </React.Suspense>
      ) : null}

      <Form method="GET" className="flex gap-2">
        <Input
          defaultValue={query ?? undefined}
          type="text"
          name="query"
          placeholder="Study the bible"
          autoComplete="off"
        />
        <Button type="submit">{loading ? "Loading..." : "Search"}</Button>
      </Form>
    </main>
  );
}
