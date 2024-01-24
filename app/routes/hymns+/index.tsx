import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";

import { getHymns, getHymnSearchParams } from "~/lib/hymns.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { sort } = getHymnSearchParams(request);

  return json(Object.values(await getHymns(sort)), {
    headers: {
      "cache-control": cacheHeader({
        public: true,
        maxAge: "1month",
        staleWhileRevalidate: "1year",
      }),
    },
  });
};

export default function Hymns() {
  const hymns = useLoaderData<typeof loader>();

  return (
    <nav className="flex flex-col gap-2">
      {hymns.map((hymn) => (
        <Link prefetch="intent" key={hymn.number} to={`/hymns/${hymn.number}`} className="p-2 hover:underline">
          <span className="tabular-nums">{hymn.number}</span>. {hymn.title}
        </Link>
      ))}
    </nav>
  );
}
