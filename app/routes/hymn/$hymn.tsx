import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { motion } from "framer-motion";
import { Chord, Scale } from "tonal";
import * as React from "react";

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

  return json(
    {
      prevHymn,
      hymn,
      nextHymn,
      semitone,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
};

function transposeHymn(hymn: Hymn, semitone: number) {
  const chords = hymn.lines.flatMap((line) => line.map((l) => l.chord));
  const transposed =
    semitone === 0 ? chords : chords.map((chord) => (chord ? Chord.transpose(chord, `${semitone}M`) || chord : chord));

  const scale = Scale.detect(transposed.filter(Boolean) as string[])[0];

  const transposedHymn: Hymn = {
    ...hymn,
    lines: hymn.lines.map((line) =>
      line.map(({ lyric }) => ({
        chord: transposed.shift(),
        lyric,
      })),
    ),
  };
  return [transposedHymn, scale] as const;
}

export default function HymnPage() {
  const { hymn, nextHymn, prevHymn, semitone } = useLoaderData<typeof loader>();
  const ref = React.useRef<HTMLDivElement>(null);
  useFitTextToScreen(ref);

  const [transposedHymn, scale] = transposeHymn(hymn, semitone);

  return (
    <div className="flex flex-col gap-8">
      <HymnCommandBar semitone={semitone} />

      <div>
        <span className="text-sm">{scale}</span>
        <h3 className="text-3xl">
          {hymn.number.padStart(3, "0")}. {hymn.title}
        </h3>
      </div>
      <div className="flex flex-col gap-4" ref={ref}>
        {transposedHymn.lines.map((line, lineIndex) => (
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
    </div>
  );
}

function useFitTextToScreen(ref: React.RefObject<HTMLElement>, initialFontSize = 16) {
  const fontSize = React.useRef(initialFontSize);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const fitTextToScreenHeight = () => {
      if (!ref.current) return;

      const container = ref.current;
      const screenHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const containerWidth = container.offsetWidth;

      // Calculate the total text length
      const totalTextLength = container.textContent ? container.textContent.length : 1;

      // Calculate the available area on the screen
      const availableArea = screenHeight * containerWidth;

      // Estimate the font size by dividing the available area by the total text length
      const estimatedFontSize = availableArea / totalTextLength;

      // Apply a scaling factor to fine-tune the font size
      const scalingFactor = 0.02;
      const optimalFontSize = estimatedFontSize * scalingFactor;

      // Clamp the font size to a desired minimum and maximum range
      const minFontSize = 6;
      const maxFontSize = 40;
      const clampedFontSize = Math.floor(Math.min(Math.max(optimalFontSize, minFontSize), maxFontSize));

      fontSize.current = clampedFontSize;
      container.style.fontSize = clampedFontSize + "px";
    };

    window.addEventListener("resize", fitTextToScreenHeight);
    fitTextToScreenHeight();

    return () => {
      window.removeEventListener("resize", fitTextToScreenHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    <div className="flex w-full items-center justify-between gap-4 text-lg sm:justify-center">
      <Link
        to={{
          search: addToSearchParams(searchParams, {
            semitone: ((semitone + 1) % 13).toString(),
          }).toString(),
        }}
      >
        <Button variant="outline" size="lg">
          Up
        </Button>
      </Link>
      <div>Capo: {calculateCapoFret(semitone)}</div>
      <Link
        to={{
          search: addToSearchParams(searchParams, {
            semitone: ((semitone - 1 + 13) % 13).toString(),
          }).toString(),
        }}
      >
        <Button variant="outline" size="lg">
          Down
        </Button>
      </Link>
    </div>
  );
}
