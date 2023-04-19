import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getHymns, getHymnSearchParams } from "~/lib/hymns.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { sort } = getHymnSearchParams(request);

  return Object.values(await getHymns(sort));
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
