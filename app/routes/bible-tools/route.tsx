import { defer } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import * as React from 'react';

import { Button, buttonVariants } from '~/components/button';
import { Input } from '~/components/input';

import { explore, searchAndChat } from './utils.server';

export let meta: MetaFunction = () => [
  {
    title: 'Bible study tools',
  },
];

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const query = new URL(request.url).searchParams.get('query') ?? '';
  if (!query) return null;

  const result = searchAndChat(query);

  return defer({
    result: result.unwrap(),
    explore: result.flatMap(explore).match({
      Ok: (res) => res,
      Err: () => [],
    }),
  });
};

export default function EgwSearchPage() {
  const [params] = useSearchParams();
  const query = params.get('query');
  const formState = useNavigation();

  let data = useLoaderData<typeof loader>();

  const loading = formState.state !== 'idle';

  return (
    <main className="h-min-0 flex h-full flex-col justify-between gap-4">
      <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto">
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
                            <li
                              key={result.label}
                              className="flex flex-col gap-1"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-shrink-0 font-mono text-sm text-neutral-300"
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
                        <ul className="flex flex-wrap gap-2">
                          {data!.egw.map((result) => (
                            <li
                              key={result.label}
                              className="flex flex-col gap-1"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-shrink-0 font-mono text-sm text-neutral-300"
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
              <div className="flex flex-col gap-1">
                {data?.map((question) => (
                  <Link
                    to={{
                      search: new URLSearchParams({
                        query: question,
                      }).toString(),
                    }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
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

      <Form
        method="GET"
        className="flex gap-2"
      >
        <Input
          defaultValue={query ?? undefined}
          type="text"
          name="query"
          placeholder="Study the bible"
          autoComplete="off"
        />
        <Button type="submit">{loading ? 'Loading...' : 'Search'}</Button>
      </Form>
    </main>
  );
}
