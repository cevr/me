import { load } from "cheerio";
import * as z from "zod";

import type { Hymn } from "~/types/hymn";
import { GithubCMS } from "./github.server";
import { TaskQueue } from "./utils";
import { allLimited } from "./utils/promises";

declare global {
  var hymnCache: {
    data?: {
      hymns: Hymn[];
      content: string;
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
    const response = await fetch("https://bradwarden.com/music/hymnchords");

    if (!response.ok) {
      throw new Error("Could not fetch hymns");
    }
    const text = await response.text();

    const $ = load(text);
    const choFiles = $("a")
      .map(function () {
        const url = new URL($(this).attr("href")!, "https://bradwarden.com/music/hymnchords/");
        return url;
      })
      .get()
      .filter((url) => {
        const searchParams = new URLSearchParams(url.search);
        const hymnNumber = searchParams.get("num");
        return !!hymnNumber;
      })
      .map((url) => {
        const searchParams = new URLSearchParams(url.search);
        const hymnNumber = searchParams.get("num");
        return hymnNumber;
      })
      .map((hymnNumber) => `https://bradwarden.com/music/hymnchords/cho/?${hymnNumber!}`);

    const content = await allLimited(
      choFiles.map((url) => async () => {
        console.log("fetching", url);
        const text = await fetch(url).then((r) => r.text());
        console.log("fetched", url);
        const $ = load(text);
        return $("pre").text();
      }),
      50,
    ).then((responses) => responses.join("\n"));

    const hymns = parseCho(content);
    pushHymnsToPublic(hymns);

    hymnCache.data = {
      hymns,
      content,
      timestamp: Date.now(),
    };
    return hymns;
  }
  return fetchQueue.add("hymns", doFetch);
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
      content: "",
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
  semitone: z.preprocess(
    (x) => {
      if (typeof x === "string") return parseInt(x);
    },
    z
      .number()
      .min(0)
      .max(12)
      .nullable()
      .default(0)
      .transform((x) => x ?? 0),
  ),
});

export function getHymnSearchParams(req: Request) {
  const url = new URL(req.url);
  const sort = url.searchParams.get("sort");
  const semitone = url.searchParams.get("semitone");
  const params = hymnSearchParamsSchema.safeParse({
    sort,
    semitone,
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
      const title = line.slice(7, -1).trim();
      const number = title.match(/^\d+/)![0];
      const titleWithoutNumber = title.slice(number.length + 1).trim();
      currentHymn = {
        title: titleWithoutNumber,
        number,
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
