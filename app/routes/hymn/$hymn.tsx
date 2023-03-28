import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { Chord, Scale } from "tonal";

import { getHymn, getHymnSearchParams } from "~/lib/hymns.server";
import type { Hymn } from "~/types/hymn";

export let loader = async ({ params, request }: LoaderArgs) => {
  const number = params.hymn;
  if (!number) {
    throw new Error("hymnNumber is required");
  }
  const { sort, semitone } = getHymnSearchParams(request);

  const [prevHymn, hymn, nextHymn] = await getHymn(sort, number);

  const chords = hymn.lines.flatMap((line) =>
    line.map((l) => l.chord).filter(Boolean as unknown as (chord: string | undefined) => chord is string),
  );
  const transposed = semitone === 0 ? chords : chords.map((chord) => Chord.transpose(chord, `${semitone}M`));

  const scale = Scale.detect(transposed);

  const transposedHymn: Hymn = {
    ...hymn,
    lines: hymn.lines.map((line) =>
      line.map(({ chord, lyric }) => ({
        chord: chord ? transposed.shift() : chord,
        lyric,
      })),
    ),
  };

  return {
    prevHymn,
    hymn: transposedHymn,
    nextHymn,
    scale: scale[0],
  };
};

export default function HymnPage() {
  const { hymn, nextHymn, prevHymn, scale } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-sm">{scale}</span>
        <h3 className="text-2xl">
          {hymn.number.padStart(3, "0")}. {hymn.title}
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {hymn.lines.map((line, lineIndex) => (
          <div key={`line-${lineIndex}`} className="flex gap-x-2 gap-y-4 flex-wrap">
            {line.map(({ lyric, chord }, lyricIndex) => (
              <div className="flex flex-col justify-between w-max break-before-all" key={lyric + chord + lyricIndex}>
                <motion.span
                  key={`${chord}-${lyricIndex}`}
                  className="leading-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {chord}
                </motion.span>
                <span className="flex-shrink-0 flex" key={`lyric-${lyricIndex}`}>
                  {lyric}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <span className="text-[10px]">{hymn.reference}</span>

      <div className="flex w-full justify-between flex-wrap">
        <div className="flex flex-col gap-2">
          {prevHymn ? (
            <a className="p-2 underline" href={`/hymn/${prevHymn?.number}`}>
              ← {prevHymn.number.padStart(3, "0")}. {prevHymn?.title}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          {nextHymn ? (
            <a className="p-2 underline" href={`/hymn/${nextHymn.number}`}>
              {nextHymn.number.padStart(3, "0")}. {nextHymn.title} →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
