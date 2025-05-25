import type { LoaderFunctionArgs } from 'react-router';
import { Link, useLoaderData } from 'react-router';

import { HymnCombobox } from './hymn-combobox';
import hymnsData from './hymns.json';

type Hymn = {
  title: string;
  number: string;
  reference: string;
  lines: Array<Array<{ lyric: string; chord: string }>>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';

  let filteredHymns = hymnsData as Hymn[];

  if (search) {
    filteredHymns = (hymnsData as Hymn[]).filter(
      (hymn) =>
        hymn.title.toLowerCase().includes(search.toLowerCase()) ||
        hymn.number.includes(search),
    );
  }

  return { hymns: filteredHymns, search };
}

export default function Hymns() {
  const { hymns, search } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-2xl p-8 font-mono">
      <div className="flex flex-col gap-12">
        <h1 className="text-center text-4xl font-light tracking-tight">
          Hymnal
        </h1>

        {/* Hymn Combobox */}
        <HymnCombobox />

        {/* Hymns List */}
        <div className="space-y-1">
          {hymns.map((hymn: Hymn) => (
            <Link
              key={hymn.number}
              to={`/hymns/${hymn.number}`}
              className="hover:text-primary grid grid-cols-[auto_1fr] gap-2 py-1 transition-colors hover:underline"
            >
              <span className="font-mono">{hymn.number}.</span>
              <span>{hymn.title}</span>
            </Link>
          ))}
        </div>

        {hymns.length === 0 && search && (
          <div className="py-12 text-center text-gray-500">
            No hymns found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
