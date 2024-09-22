import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  json,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import clsx from 'clsx';
import { cacheHeader } from 'pretty-cache-header';
import React from 'react';
import { useDebounceFetcher } from 'remix-utils/use-debounce-fetcher';

import {
  ComboBox,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxPopover,
  ExternalLink,
} from '~/components';
import { Label } from '~/components/label';
import { getHymns, getHymnSearchParams } from '~/lib/hymns.server';
import { addToSearchParams } from '~/lib/utils';
import type { Hymn } from '~/types/hymn';

export let meta: MetaFunction = () => [
  {
    title: 'Hymns',
  },
];

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  let hymns = await getHymns();
  return json(
    {
      ...getHymnSearchParams(request),
      initialHymns: hymns.slice(0, 9),
    },
    {
      headers: {
        'cache-control': cacheHeader({
          public: true,
          maxAge: '1week',
          staleWhileRevalidate: '1year',
        }),
      },
    },
  );
};

export default function Hymns() {
  const [searchParams] = useSearchParams();
  const { sort, initialHymns } = useLoaderData<typeof loader>();
  const fetcher = useDebounceFetcher<Hymn[]>();
  const navigate = useNavigate();

  // combobox has trouble dealing with async data, so we need to keep track of
  // the last items we had and use that if we don't have any new ones
  // TODO: remove this when fixed

  return (
    <div className="flex max-w-[calc(100vw_-_32px)] flex-col gap-2 font-mono">
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <Link
            to={{
              pathname: '/hymns',
              search: searchParams.toString(),
            }}
            className="text-2xl font-bold duration-200 hover:text-salmon-500"
          >
            Hymns
          </Link>

          <Link
            className={clsx('duration-200 hover:text-salmon-500', {
              'text-salmon-500 underline': sort === 'number',
            })}
            to={{
              search: addToSearchParams(searchParams, {
                sort: 'number',
              }).toString(),
            }}
          >
            By Number
          </Link>

          <Link
            className={clsx('duration-200 hover:text-salmon-500', {
              'text-salmon-500 underline': sort === 'title',
            })}
            to={{
              search: addToSearchParams(searchParams, {
                sort: 'title',
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
          onSelectionChange={(hymn) => {
            if (!hymn) return;
            navigate({
              pathname: `/hymns/${hymn}`,
              search: searchParams.toString(),
            });
          }}
          defaultItems={initialHymns}
          items={fetcher.data}
          aria-label="Search hymns"
          menuTrigger="focus"
        >
          <Label>Search</Label>
          <ComboBoxInput
            placeholder="Search by number or title"
            className="md:max-w-sm"
          />
          <ComboBoxPopover>
            <ComboBoxContent items={fetcher.data}>
              {(hymn) => (
                <ComboBoxItem
                  className="font-mono"
                  textValue={hymn.number}
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
      <span className="px-2 py-6 text-[10px]">
        The Seventh-day Adventist Hymnal. Chords by{' '}
        <ExternalLink href="https://bradwarden.com/music/hymnchords">
          Brad Warden
        </ExternalLink>
      </span>
    </div>
  );
}
