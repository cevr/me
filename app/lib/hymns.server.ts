import * as z from "zod";
import { load } from "cheerio";
import { Chord, Interval, Note, Scale } from "tonal";

import type { Hymn } from "~/types/hymn";

import { GithubCMS } from "./github.server";
import { keys } from "./hymns";
import { TaskQueue } from "./utils";
import { allLimited } from "./utils/promises";

declare global {
  var hymnCache: {
    data?: {
      hymns: Hymn[];
      timestamp: number;
    };
  };
  var fetchQueue: TaskQueue<Hymn[]>;
}

const hymnsFilename = "hymns.json";

let hymnCache: typeof global.hymnCache = {};
let fetchQueue = new TaskQueue<Hymn[]>();

if (process.env.NODE_ENV !== "production") {
  if (!global.hymnCache) {
    global.hymnCache = {};
  }
  hymnCache = global.hymnCache;
  if (!global.fetchQueue) {
    global.fetchQueue = new TaskQueue<Hymn[]>();
  }
  fetchQueue = global.fetchQueue;
}

function fetchHymns() {
  async function doFetch() {
    const baseUrl = "https://bradwarden.com/music/hymnchords";
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error("Could not fetch hymns");
    }
    const text = await response.text();

    const $ = load(text);
    const choFiles = await allLimited(
      $("a")
        .map(function () {
          return $(this).text();
        })
        .get()
        .map((url) => {
          // 608. Faith Is the Victory
          // we want to turn it into 608-Faith-Is-the-Victory
          const match = url.match(/^(\d+)\. (.*)$/);
          if (!match) {
            return null;
          }
          const [, hymnNumber] = match;
          // also remove any non-alphanumeric characters
          // replace spaces with dashes
          // ensure no consecutive dashes
          return hymnNumber;
        })
        .map((number) => `${baseUrl}/?num=${number}`)
        .map(
          (url) => () =>
            fetch(url)
              .then((res) => res.text())
              .then((text) => {
                const $ = load(text);
                const choATag = $("a").filter((i, el) => !!$(el).attr("href")?.endsWith(".cho"));
                const choUrl = choATag?.attr("href");
                if (choUrl) {
                  const url = new URL(choUrl, baseUrl + "/").toString();
                  console.log(`Found cho file: ${url}`);
                  return url;
                }
                return undefined;
              }),
        ),
      50,
    );

    const hymnsWithCho = choFiles.filter(Boolean as unknown as (file: string | undefined) => file is string);

    console.log(`Found ${hymnsWithCho.length} hymns with cho files.`);

    const content = await allLimited(
      hymnsWithCho.map((url) => async () => {
        console.log("fetching", url);
        const res = await fetch(url);
        if (!res.ok) {
          return "";
        }
        return res.text();
      }),
      50,
    ).then((responses) => responses.join("\n"));

    const hymns = parseCho(content);
    pushHymnsToPublic(hymns);

    hymnCache.data = {
      hymns,
      timestamp: Date.now(),
    };
    return hymns;
  }
  return fetchQueue.add("hymns", () => doFetch());
}

export async function getHymns(sortBy: "number" | "title"): Promise<Hymn[]> {
  let hymns: Hymn[];
  if (hymnCache.data) {
    maybeInvalidate();
    hymns = hymnCache.data.hymns;
  } else {
    const response = await GithubCMS.get(hymnsFilename);
    hymns = await response.json();
    hymnCache.data = {
      hymns,
      timestamp: Date.now(),
    };
    return hymns;
  }

  if (sortBy === "title") {
    return hymns.slice().sort((a, b) => a.title.localeCompare(b.title));
  }
  return hymns;
}

function pushHymnsToPublic(hymns: Hymn[]) {
  GithubCMS.push(hymnsFilename, hymns, "Update hymns");
}

const hymnSearchParamsSchema = z.object({
  sort: z
    .union([z.literal("title"), z.literal("number")])
    .nullable()
    .default("number")
    .transform((x) => x ?? "number"),
  key: z
    .enum(keys)
    .nullable()
    .default(null)
    .transform((x) => x ?? undefined),
});

export type HymnSearchParams = z.infer<typeof hymnSearchParamsSchema>;

export function getHymnSearchParams(req: Request): HymnSearchParams {
  const url = new URL(req.url);
  const sort = url.searchParams.get("sort");
  const key = url.searchParams.get("key");
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
  sortBy: "title" | "number",
  number: string,
): Promise<[prev: Hymn | undefined, curr: Hymn, next: Hymn | undefined]> {
  const hymns = await getHymns(sortBy);
  const index = hymns.findIndex((h) => h.number === number);
  if (index === -1) {
    throw new Error("Could not find hymn");
  }
  const prev = hymns[index - 1];
  const curr = hymns[index];
  const next = hymns[index + 1];
  return [prev, curr, next];
}

async function maybeInvalidate() {
  if (hymnCache.data && Date.now() - hymnCache.data.timestamp > 1000 * 60 * 60 * 24) {
    try {
      await fetchHymns();
    } catch (e) {
      console.error("Could not invalidate hymns");
    }
  }
}

function parseCho(cho: string): Hymn[] {
  type Hymn = {
    title: string;
    number: string;
    reference: string;
    lines: {
      lyric: string;
      chord?: string;
    }[][];
  };
  const lines = cho.split("\n");
  const hymns: Hymn[] = [];
  let currentHymn: Hymn | undefined;

  lines.forEach((line) => {
    if (!line.trim()) return;
    if (line.startsWith("{title:")) {
      // title ex: 36. O Thou in Whose Presence
      // we want to separate the number from the title and use that as the number
      // and the title as the title
      // parse the title between the {title:}
      const match = line.match(/{title:(.*)}/);
      const numberAndTitle = match![1].trim();
      const number = numberAndTitle.split(".")[0];
      const title = numberAndTitle.slice(number.length + 1).trim();

      currentHymn = {
        title,
        number: number.padStart(3, "0"),
        lines: [],
        reference: "",
      };
      hymns.push(currentHymn);
    } else if (line.startsWith("# Reference:")) {
      currentHymn!.reference = line.slice(13).trim();
    } else {
      const segment = [];

      let lyricAndChord = {
        lyric: "",
        chord: "",
      };
      let inChord = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === "[") {
          inChord = true;
          (lyricAndChord.chord || lyricAndChord.lyric) &&
            segment.push(lyricAndChord) &&
            (lyricAndChord = { lyric: "", chord: "" });
        } else if (char === "]") {
          inChord = false;
        } else {
          inChord ? (lyricAndChord.chord += char) : (lyricAndChord.lyric += char);
        }
      }

      lyricAndChord && segment.push(lyricAndChord);
      currentHymn && currentHymn.lines.push(segment);
    }
  });

  return hymns;
}

export function transposeHymn(hymn: Hymn, key: HymnSearchParams["key"]): [Hymn & { scale: string }, number] {
  const chords = hymn.lines.flatMap((line) => line.map((l) => l.chord));

  const originalScale = Scale.detect(chords.filter(Boolean) as string[])[0].split(" ")[0];
  if (!key) {
    return [
      {
        ...hymn,
        scale: originalScale,
      },
      0,
    ];
  }
  const { tonic } = Chord.get(key);
  const interval = Interval.distance(Note.get(originalScale), Note.get(tonic as string));

  const transposed = chords.map((chord) => (chord ? Chord.transpose(chord, interval) : chord));

  const scale = Scale.detect(transposed.filter(Boolean) as string[])[0]?.split(" ")[0] ?? "";

  const transposedHymn = {
    ...hymn,
    lines: hymn.lines.map((line) =>
      line.map(({ lyric }) => ({
        chord: transposed.shift(),
        lyric,
      })),
    ),
    scale,
  };

  // get number from the interval string
  const semitone = Interval.semitones(interval) ?? 0;
  return [transposedHymn, semitone];
}
