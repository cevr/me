import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import clsx from "clsx";

import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { Popover } from "~/components/popover";
import { getHymnSearchParams } from "~/lib/hymns.server";
import type { Hymn } from "~/types/hymn";

export let meta: MetaFunction = () => ({
  title: "Hymns",
});

export let loader = async ({ request }: LoaderArgs) => {
  return getHymnSearchParams(request);
};

function calculateCapoFret(semitones: number) {
  const absSemitones = Math.abs(semitones);
  if (semitones === 0) {
    return 0;
  }

  return 12 - absSemitones;
}

function addToSearchParams(searchParams: URLSearchParams, params: Record<string, string> | [string, string][]) {
  const newSearchParams = new URLSearchParams(searchParams);
  if (Array.isArray(params)) {
    params.forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });
  }
  Object.entries(params).forEach(([key, value]) => {
    newSearchParams.set(key, value);
  });
  return newSearchParams;
}

export default function Hymns() {
  const [searchParams] = useSearchParams();
  const { semitone, sort } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Hymn[]>();

  return (
    <div className="flex flex-col gap-8 font-mono">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link to="/hymn" className="duration-200 hover:text-[var(--highlight)]">
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
              className="w-[calc(100vw-80px)] p-0"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                fetcher.load(`/hymn/search?q=`);
              }}
            >
              <div className="flex w-full flex-col gap-2  rounded-md bg-[var(--link-bg)] py-2 px-4">
                {fetcher.data?.map((hymn) => (
                  <Link
                    key={hymn.number}
                    to={{
                      pathname: `/hymn/${hymn.number}`,
                      search: searchParams.toString(),
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm tabular-nums">{hymn.number.padStart(3, "0")}.</span>
                    <span className="text-sm">{hymn.title}</span>
                  </Link>
                ))}
              </div>
            </Popover.Content>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={{
              search: addToSearchParams(searchParams, {
                semitone: ((semitone + 1) % 12).toString(),
              }).toString(),
            }}
          >
            <Button variant="outline">Up</Button>
          </Link>
          <div>Capo: {calculateCapoFret(semitone)}</div>
          <Link
            to={{
              search: addToSearchParams(searchParams, {
                semitone: ((semitone - 1 + 12) % 12).toString(),
              }).toString(),
            }}
          >
            <Button variant="outline">Down</Button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
