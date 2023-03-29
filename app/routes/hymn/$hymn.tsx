import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { motion } from "framer-motion";
import { Chord, Scale } from "tonal";
import { Button } from "~/components/button";

import { getHymn, getHymnSearchParams } from "~/lib/hymns.server";
import { addToSearchParams } from "~/lib/utils";
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
    semitone,
  };
};

export default function HymnPage() {
  const { hymn, nextHymn, prevHymn, scale, semitone } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 pb-[116px]">
      <div>
        <span className="text-sm">{scale}</span>
        <h3 className="text-2xl">
          {hymn.number.padStart(3, "0")}. {hymn.title}
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {hymn.lines.map((line, lineIndex) => (
          <div key={`line-${lineIndex}`} className="flex flex-wrap gap-2">
            {line.map(({ lyric, chord }, lyricIndex) => (
              <div className="flex w-max break-before-all flex-col justify-between" key={lyric + chord + lyricIndex}>
                <motion.span
                  key={`${chord}-${lyricIndex}`}
                  className="leading-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {chord}
                </motion.span>
                <span className="flex" key={`lyric-${lyricIndex}`}>
                  {lyric}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <span className="text-[10px]">{hymn.reference}</span>
      <div className="flex w-full flex-col justify-between md:flex-row">
        <div className="flex flex-col gap-2">
          {prevHymn ? (
            <a className="p-2 underline" href={`/hymn/${prevHymn?.number}`}>
              ← {prevHymn.number.padStart(3, "0")}. {prevHymn?.title}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col justify-end gap-2 text-end">
          {nextHymn ? (
            <a className="p-2 underline" href={`/hymn/${nextHymn.number}`}>
              {nextHymn.number.padStart(3, "0")}. {nextHymn.title} →
            </a>
          ) : null}
        </div>
      </div>
      <HymnCommandBar semitone={semitone} />
    </div>
  );
}

function calculateCapoFret(semitones: number) {
  const absSemitones = Math.abs(semitones);
  if (semitones === 0) {
    return 0;
  }

  return 12 - absSemitones;
}

function HymnCommandBar({ semitone }: { semitone: number }) {
  const [searchParams] = useSearchParams();
  return (
    <div className="fixed bottom-4 flex w-[calc(100%-32px)] items-center justify-between gap-2 rounded-lg border border-primary-300 bg-neutral-800 py-2 px-4">
      <Link
        to={{
          search: addToSearchParams(searchParams, {
            semitone: ((semitone + 1) % 12).toString(),
          }).toString(),
        }}
      >
        <Button variant="outline">Up</Button>
      </Link>
      <div>Capo: {calculateCapoFret(semitone)}</div>
      <Link
        to={{
          search: addToSearchParams(searchParams, {
            semitone: ((semitone - 1 + 12) % 12).toString(),
          }).toString(),
        }}
      >
        <Button variant="outline">Down</Button>
      </Link>
    </div>
  );
}
