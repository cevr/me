import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import clsx from "clsx";

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
  const [searchParams] = useSearchParams();
  const { sort } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Hymn[]>();

  return (
    <div className="flex max-w-[calc(100vw_-_32px)] flex-col gap-8 font-mono">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link
            to={{
              pathname: "/hymn",
              search: searchParams.toString(),
            }}
            className="duration-200 hover:text-[var(--highlight)]"
          >
            Hymns
          </Link>

          <div className="flex gap-2">
            <Link
              className={clsx("duration-200 hover:text-[var(--highlight)]", {
                "text-[var(--highlight)] underline": sort === "number",
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
              className={clsx("duration-200 hover:text-[var(--highlight)]", {
                "text-[var(--highlight)] underline": sort === "title",
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
                onChange={(event) => {
                  fetcher.load(`/hymn/search?q=${event.target.value}`);
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
              onClick={() => {
                fetcher.load(`/hymn/search?q=`);
              }}
            >
              <div className="flex w-full flex-col gap-2  rounded-md bg-[var(--link-bg)] px-4 py-2">
                {fetcher.data?.map((hymn) => (
                  <Link
                    key={hymn.number}
                    to={{
                      pathname: `/hymn/${hymn.number}`,
                      search: searchParams.toString(),
                    }}
                    className="flex items-center gap-2 py-2 text-lg"
                  >
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
    </div>
  );
}
