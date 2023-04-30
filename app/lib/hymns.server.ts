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

const hymnsFilename = "me/hymns.json";

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
    const baseUrl = "https://bradwarden.com/music/hymnchords/";
    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error("Could not fetch hymns");
    }
    const text = await response.text();

    const $ = load(text);

    // get final <p> tag and all the <a> tags within it
    const urls = $("p")
      .last()
      .map(function () {
        return $(this)
          .find("a")
          .map(function () {
            return $(this).attr("href");
          })
          .get();
      })
      .get()
      .map((url) => new URL(url, baseUrl).toString());

    const hymns = await allLimited(
      urls.map((url) => async () => {
        console.log("fetching", url);
        const res = await fetch(url);
        if (!res.ok) {
          console.log("failed to fetch", url);
          return null;
        }
        const content = await res.text();
        return parseWebPage(content);
      }),
      50,
    ).then((responses) => responses.filter((response): response is Hymn => response !== null));

    console.log("fetched", hymns.length, "hymns");

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
    const hymns = await GithubCMS.get<Hymn[]>(hymnsFilename).unwrap();

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
  GithubCMS.push(hymnsFilename, hymns, "Update hymns").run();
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

function parseWebPage(content: string) {
  const $ = load(content);
  // if theres an anchor tag within a pre tag, then the hymn is unavailable
  const unavailable = $("pre a").text();

  if (unavailable) {
    return null;
  }
  // we want to parse the content of the pre tag
  const h2 = $("h2").text();
  const match = h2.match(/^(\d+)\. (.*)$/);
  if (!match) {
    return null;
  }
  const [, hymnNumber, hymnTitle] = match;

  const preContent = $("pre").html() || "";
  const rawLines = preContent.split("<br>");

  const parsedLines: Hymn["lines"] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trim();

    if (line === "" && hymnNumber === "251" && i === 0) {
      // special case for 251
      // the first line is blank, but this breaks the parser
      // so we just set it to Ab (the first chord)
      line = "Ab";
    }

    if (line.includes("[") || line.includes("(") || line === "") {
      continue;
    }

    const nextLine = rawLines[i + 1] ? rawLines[i + 1].trim() : "";

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
        const nextChordPosition = chordPositions[index + 1]?.position || nextLine.length;
        const lyric = nextLine.slice(chordPosition.position, nextChordPosition).trim();
        return { lyric, chord: chordPosition.chord };
      });

      parsedLines.push(combinedLine);
      i++; // Skip the next line since it's already processed
    }
  }

  return {
    title: hymnTitle,
    number: hymnNumber.padStart(3, "0"),
    reference: "The Seventh-day Adventist Hymnal. Chords by https://bradwarden.com/music/hymnchords",
    lines: parsedLines,
  };
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
