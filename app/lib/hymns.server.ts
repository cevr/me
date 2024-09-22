import { cachified } from '@epic-web/cachified';
import type { CacheEntry } from '@epic-web/cachified';
import { load } from 'cheerio';
import { Option } from 'ftld';
import { LRUCache } from 'lru-cache';
import { matchSorter } from 'match-sorter';
import { Chord, Interval, Note, Scale } from 'tonal';
import * as z from 'zod';

import type { Hymn } from '~/types/hymn';

import { GithubCMS } from './github.server';
import { keys } from './hymns';
import type { TaskQueue } from './utils';

declare global {
  var hymnCache: {
    data?: {
      hymns: Hymn[];
      timestamp: number;
    };
  };
  var fetchQueue: TaskQueue<Hymn[]>;
}

const hymnsFilename = 'me/hymns.json';

// function fetchHymns() {
//   async function doFetch() {
//     const baseUrl = "https://bradwarden.com/music/hymnchords/";
//     const response = await fetch(baseUrl);

//     if (!response.ok) {
//       throw new Error("Could not fetch hymns");
//     }
//     const text = await response.text();

//     const $ = load(text);

//     // get final <p> tag and all the <a> tags within it
//     const urls = $("p")
//       .last()
//       .map(function () {
//         return $(this)
//           .find("a")
//           .map(function () {
//             return $(this).attr("href");
//           })
//           .get();
//       })
//       .get()
//       .map((url) => new URL(url, baseUrl).toString());

//     const hymns = await allLimited(
//       urls.map((url) => async () => {
//         console.log("fetching", url);
//         const res = await fetch(url);
//         if (!res.ok) {
//           console.log("failed to fetch", url);
//           return null;
//         }
//         const content = await res.text();
//         return parseWebPage(content);
//       }),
//       50,
//     ).then((responses) => responses.filter((response): response is Hymn => response !== null));

//     console.log("fetched", hymns.length, "hymns");

//     pushHymnsToPublic(hymns);

//     hymnCache.data = {
//       hymns,
//       timestamp: Date.now(),
//     };
//     return hymns;
//   }
//   return fetchQueue.add("hymns", () => doFetch());
// }
let cache = new LRUCache<string, CacheEntry<Hymn[]>>({ max: 1000 });
export async function getHymns(): Promise<Hymn[]> {
  return await cachified({
    cache: cache as any,
    key: 'hymns',
    getFreshValue: async () => GithubCMS.get<Hymn[]>(hymnsFilename).unwrap(),
  });
}
export async function getSortedHymns(
  sortBy: 'number' | 'title',
): Promise<Hymn[]> {
  let hymns: Hymn[] = await getHymns();

  if (sortBy === 'title') {
    return hymns.slice().sort((a, b) => a.title.localeCompare(b.title));
  }
  return hymns;
}

export async function getFilteredHymns(request: Request): Promise<Hymn[]> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  return cachified({
    cache: cache as any,
    key: query ? `filtered-hymns-${query}` : 'filtered-hymns',
    getFreshValue: async () => {
      let hymns = await getSortedHymns('number');
      if (query) {
        hymns = matchSorter(hymns, query, {
          keys: ['title', 'number'],
        });
      }
      return hymns.slice(0, 9);
    },
  });
}

export function pushHymnsToPublic(hymns: Hymn[]) {
  GithubCMS.push(hymnsFilename, hymns, 'Update hymns').run();
}

const hymnSearchParamsSchema = z.object({
  sort: z
    .union([z.literal('title'), z.literal('number')])
    .nullable()
    .default('number')
    .transform((x) => x ?? 'number'),
  key: z
    .enum(keys)
    .nullable()
    .default(null)
    .transform((x) => x ?? undefined),
});

export type HymnSearchParams = z.infer<typeof hymnSearchParamsSchema>;

export function getHymnSearchParams(req: Request): HymnSearchParams {
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort');
  const key = url.searchParams.get('key');
  const params = hymnSearchParamsSchema.safeParse({
    sort,
    key,
  });
  if (!params.success) {
    throw new Error(params.error.message);
  }
  return params.data;
}

export async function getHymn(
  sortBy: 'title' | 'number',
  number: string,
): Promise<[prev: Hymn | undefined, curr: Hymn, next: Hymn | undefined]> {
  return (await cachified({
    cache: cache as any,
    key: `hymn-${number}`,
    getFreshValue: async () => {
      const hymns = await getSortedHymns(sortBy);
      const index = hymns.findIndex((h) => h.number === number);
      if (index === -1) {
        throw new Error('Could not find hymn');
      }
      const prev = hymns[index - 1];
      const curr = hymns[index];
      const next = hymns[index + 1];
      return [prev, curr, next];
    },
  })) as [prev: Hymn | undefined, curr: Hymn, next: Hymn | undefined];
}

export function parseWebPage(content: string) {
  const $ = load(content);
  // if theres an anchor tag within a pre tag, then the hymn is unavailable
  const unavailable = $('pre a').text();

  if (unavailable) {
    return null;
  }
  // we want to parse the content of the pre tag
  const h2 = $('h2').text();
  const match = h2.match(/^(\d+)\. (.*)$/);
  if (!match) {
    return null;
  }
  const [, hymnNumber, hymnTitle] = match;

  const preContent = $('pre').html() || '';
  const rawLines = preContent.split('<br>');

  const parsedLines: Hymn['lines'] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();

    if (line === '' && hymnNumber === '251' && i === 0) {
      // special case for 251
      // the first line is blank, but this breaks the parser
      // so we just set it to Ab (the first chord)
      line = 'Ab';
    }

    if (line.includes('[') || line.includes('(') || line === '') {
      continue;
    }

    const nextLine = rawLines[i + 1] ? rawLines[i + 1].trim() : '';

    if (nextLine) {
      const chordRegex = /([A-G](?:#|b)?(?:m|M|dim|aug|sus)?(?:\d)?)|(\s+)/g;
      const chordMatches = line.matchAll(chordRegex);

      const chordPositions: { chord: string; position: number }[] = [];
      let currentPosition = 0;

      for (const match of chordMatches) {
        if (match[1]) {
          chordPositions.push({ chord: match[1], position: currentPosition });
        }
        currentPosition += match[0].length;
      }

      const combinedLine = chordPositions.map((chordPosition, index) => {
        const nextChordPosition =
          chordPositions[index + 1]?.position || nextLine.length;
        const lyric = nextLine
          .slice(chordPosition.position, nextChordPosition)
          .trim();
        return { lyric, chord: chordPosition.chord };
      });

      parsedLines.push(combinedLine);
      i++; // Skip the next line since it's already processed
    }
  }

  return {
    title: hymnTitle,
    number: hymnNumber.padStart(3, '0'),
    reference:
      'The Seventh-day Adventist Hymnal. Chords by https://bradwarden.com/music/hymnchords',
    lines: parsedLines,
  };
}

export function transposeHymn(
  hymn: Hymn,
  key: HymnSearchParams['key'],
): [Hymn & { originalScale?: string; scale?: string }, number] {
  const chords = hymn.lines
    .flatMap((line) => line.map((l) => l.chord))
    .filter(Boolean) as string[];

  const originalScale = Option.from(Scale.detect(chords)[0]).flatMap((s) =>
    Option.from(s.split(' ')[0]),
  );

  if (!key || originalScale.isNone()) {
    return [
      {
        ...hymn,
        originalScale: originalScale.unwrapOr(''),
      },
      0,
    ];
  }
  const { tonic } = Chord.get(key);
  const interval = Interval.distance(
    Note.get(originalScale.unwrap()),
    Note.get(tonic as string),
  );

  const transposed = chords.map((chord) =>
    chord ? Chord.transpose(chord, interval) : chord,
  );

  const scale = Scale.detect(transposed)[0]?.split(' ')[0] ?? '';

  const transposedHymn = {
    ...hymn,
    lines: hymn.lines.map((line) =>
      line.map(({ lyric }) => ({
        chord: transposed.shift(),
        lyric,
      })),
    ),
    originalScale: originalScale.unwrapOr(''),
    scale,
  };

  // get number from the interval string
  const semitone = Interval.semitones(interval) ?? 0;
  return [transposedHymn, semitone];
}
