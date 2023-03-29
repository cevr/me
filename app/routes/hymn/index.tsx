import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";

import { getHymnSearchParams, getHymns } from "~/lib/hymns.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { sort } = getHymnSearchParams(request);

  return json(Object.values(await getHymns(sort)), {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
};

export default function Hymns() {
  const hymns = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <nav className="flex flex-col gap-2">
      {hymns.map((hymn) => (
        <Link
          prefetch="intent"
          key={hymn.number}
          to={{
            pathname: `/hymn/${hymn.number}`,
            search: searchParams.toString(),
          }}
          className="p-2 hover:underline"
        >
          <span className="tabular-nums">{hymn.number.padStart(3, "0")}</span>. {hymn.title}
        </Link>
      ))}
    </nav>
  );
}
