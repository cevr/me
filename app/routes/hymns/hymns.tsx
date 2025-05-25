import type { LoaderFunctionArgs } from 'react-router';
import { Link, useLoaderData, useSearchParams } from 'react-router';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;

    if (searchValue) {
      setSearchParams({ search: searchValue });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8 font-mono">
      <h1 className="mb-12 text-center text-4xl font-light tracking-tight">
        Hymnal
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search hymns..."
            className="flex-1 border-b border-gray-300 bg-transparent px-0 py-2 font-mono focus:border-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 font-mono text-sm hover:underline"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="px-4 py-2 font-mono text-sm text-gray-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results Count */}
      {search && (
        <div className="mb-8 text-center text-sm text-gray-500">
          {hymns.length} result{hymns.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Hymns List */}
      <div className="space-y-1">
        {hymns.map((hymn: Hymn) => (
          <Link
            key={hymn.number}
            to={`/hymns/${hymn.number}`}
            className="grid grid-cols-[auto_1fr] gap-2 py-1 transition-colors hover:text-primary hover:underline"
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
  );
}
