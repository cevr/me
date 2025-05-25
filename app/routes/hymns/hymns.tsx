import { Link, useLoaderData } from 'react-router';

import { HymnCombobox } from './hymn-combobox';
import { getHymns } from './hymns.server';
import type { Hymn } from './hymns.utils';

export function meta() {
  return [{ title: 'Hymns | Hymnal' }];
}

export let loader = getHymns;

export default function Hymns() {
  const { hymns } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-2xl p-8 font-mono">
      <div className="flex flex-col gap-12">
        <h1 className="text-center text-4xl font-light tracking-tight">
          Hymnal
        </h1>

        {/* Hymn Combobox */}
        <HymnCombobox />

        {/* Hymns List */}
        <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
}
