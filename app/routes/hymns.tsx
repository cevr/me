import * as React from "react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import clsx from "clsx";

import { ExternalLink } from "~/components";
import { Input } from "~/components/input";
import { Popover } from "~/components/popover";
import { getHymnSearchParams } from "~/lib/hymns.server";
import { addToSearchParams } from "~/lib/utils";
import type { Hymn } from "~/types/hymn";

export let meta: MetaFunction = () => ({
  title: "Hymns",
});

export let loader = ({ request }: LoaderArgs) => {
  return getHymnSearchParams(request);
};

export default function Hymns() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { sort } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Hymn[]>();

  React.useEffect(() => {
    fetcher.load(`/hymns/search?q=`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="flex max-w-[calc(100vw_-_32px)] flex-col gap-8 font-mono">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link
            to={{
              pathname: "/hymns",
              search: searchParams.toString(),
            }}
            className="duration-200 hover:text-salmon-500"
          >
            Hymns
          </Link>

          <div className="flex gap-2">
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
        </div>
        <div>
          <Popover open={!!fetcher.data?.length}>
            <Popover.Anchor asChild>
              <Input
                placeholder="Search hymns"
                onChange={(event) => {
                  fetcher.load(`/hymns/search?q=${event.target.value}`);
                }}
              />
            </Popover.Anchor>
            <Popover.Content
              sideOffset={8}
              align="start"
              className="w-[calc(100vw-32px)] p-0"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
              }}
            >
              <div className="flex w-full flex-col gap-2  rounded-md bg-neutral-800 px-4 py-2">
                {fetcher.data?.map((hymn) => (
                  <Link key={hymn.number} to={`/hymns/${hymn.number}`} className="flex items-center gap-2 py-2 text-lg">
                    <span className="tabular-nums">{hymn.number}.</span>
                    <span>{hymn.title}</span>
                  </Link>
                ))}
              </div>
            </Popover.Content>
          </Popover>
        </div>
      </div>
      <Outlet />
      <span className="text-[10px]">
        The Seventh-day Adventist Hymnal. Chords by{" "}
        <ExternalLink href="https://bradwarden.com/music/hymnchords">Brad Warden</ExternalLink>
      </span>
    </div>
  );
}
