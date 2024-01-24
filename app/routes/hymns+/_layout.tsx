import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import { cacheHeader } from "pretty-cache-header";
import React from "react";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";

import { ComboBox, ComboBoxContent, ComboBoxInput, ComboBoxItem, ComboBoxPopover, ExternalLink } from "~/components";
import { getFilteredHymns, getHymnSearchParams } from "~/lib/hymns.server";
import { addToSearchParams } from "~/lib/utils";
import type { Hymn } from "~/types/hymn";

export let meta: MetaFunction = () => [
  {
    title: "Hymns",
  },
];

export let loader = async ({ request }: LoaderFunctionArgs) => {
  let hymns = await getFilteredHymns(request);
  return json(
    { ...getHymnSearchParams(request), initialHymns: hymns },
    {
      headers: {
        "cache-control": cacheHeader({
          public: true,
          maxAge: "1week",
          staleWhileRevalidate: "1year",
        }),
      },
    },
  );
};

export default function Hymns() {
  const [searchParams] = useSearchParams();
  const { sort, initialHymns } = useLoaderData<typeof loader>();
  const fetcher = useDebounceFetcher<Hymn[]>();
  const lastItems = React.useRef<Hymn[]>(initialHymns);

  React.useEffect(() => {
    if (fetcher.data) {
      lastItems.current = fetcher.data;
    }
  }, [fetcher.data]);

  return (
    <div className="flex max-w-[calc(100vw_-_32px)] flex-col gap-8 font-mono">
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <Link
            to={{
              pathname: "/hymns",
              search: searchParams.toString(),
            }}
            className="duration-200 hover:text-salmon-500 text-2xl font-bold"
          >
            Hymns
          </Link>

          <Link
            className={clsx("duration-200 hover:text-salmon-500", {
              "text-salmon-500 underline": sort === "number",
            })}
            to={{
              search: addToSearchParams(searchParams, {
                sort: "number",
              }).toString(),
            }}
          >
            By Number
          </Link>

          <Link
            className={clsx("duration-200 hover:text-salmon-500", {
              "text-salmon-500 underline": sort === "title",
            })}
            to={{
              search: addToSearchParams(searchParams, {
                sort: "title",
              }).toString(),
            }}
          >
            By Title
          </Link>
        </div>
        <ComboBox
          onInputChange={(value) => {
            fetcher.load(`/hymns/search?q=${value}`);
          }}
          defaultItems={initialHymns}
          items={fetcher.data ?? lastItems.current}
          aria-label="Search hymns"
          menuTrigger="focus"
        >
          <ComboBoxInput placeholder="Search by number or title" />
          <ComboBoxPopover>
            <ComboBoxContent items={fetcher.data ?? lastItems.current}>
              {(hymn) => (
                <ComboBoxItem
                  className="font-mono"
                  textValue={hymn.number}
                  href={`/hymns/${hymn.number}`}
                  id={hymn.number}
                >
                  {hymn.number}: {hymn.title}
                </ComboBoxItem>
              )}
            </ComboBoxContent>
          </ComboBoxPopover>
        </ComboBox>
      </div>
      <Outlet />
      <span className="text-[10px] px-2 py-6">
        The Seventh-day Adventist Hymnal. Chords by{" "}
        <ExternalLink href="https://bradwarden.com/music/hymnchords">Brad Warden</ExternalLink>
      </span>
    </div>
  );
}
