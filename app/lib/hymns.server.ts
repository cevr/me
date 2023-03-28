import { load } from "cheerio";
import * as z from "zod";

import type { Hymn } from "~/types/hymn";

declare global {
  var hymnState: {
    hymns: Hymn[] | undefined;
    content: string | undefined;
    timestamp: number;
  };
}

global.hymnState ||= {
  hymns: undefined as Hymn[] | undefined,
  content: undefined as string | undefined,
  timestamp: Date.now(),
};

export async function getHymns(sortBy: "number" | "title"): Promise<Hymn[]> {
  if (global.hymnState.hymns) {
    maybeInvalidate();
    if (sortBy === "title") {
      return global.hymnState.hymns.slice().sort((a, b) => a.title.localeCompare(b.title));
    }
    return global.hymnState.hymns;
  }

  const response = await fetch("https://bradwarden.com/music/hymnchords/cho/");

  if (!response.ok) {
    throw new Error("Could not fetch hymns");
  }
  const text = await response.text();
  const $ = load(text);
  const content = $("pre").text();
  const hymns = parseCho(content);

  global.hymnState = {
    hymns,
    content,
    timestamp: Date.now(),
  };

  return hymns;
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
  if (global.hymnState.content && Date.now() - global.hymnState.timestamp > 1000 * 60 * 60 * 24) {
    const response = await fetch("https://bradwarden.com/music/hymnchords/cho/");
    if (!response.ok) {
      throw new Error("Could not fetch hymns");
    }
    const text = await response.text();
    const $ = load(text);
    const content = $("pre").text();
    if (content !== global.hymnState.content) {
      const hymns = parseCho(content);

      global.hymnState = {
        hymns,
        content,
        timestamp: Date.now(),
      };
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
