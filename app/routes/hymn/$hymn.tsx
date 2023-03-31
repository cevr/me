import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { motion } from "framer-motion";
import { Chord, Scale, Interval, Note } from "tonal";
import * as React from "react";
import debounce from "lodash.debounce";

import type { HymnSearchParams } from "~/lib/hymns.server";
import { keys } from "~/lib/hymns";
import { getHymn, getHymnSearchParams } from "~/lib/hymns.server";

import type { Hymn } from "~/types/hymn";
import { Select } from "~/components/select";
import { addToSearchParams } from "~/lib/utils";

export let loader = async ({ params, request }: LoaderArgs) => {
  const number = params.hymn;
  if (!number) {
    throw new Error("hymnNumber is required");
  }
  const { sort, key } = getHymnSearchParams(request);

  const [prevHymn, hymn, nextHymn] = await getHymn(sort, number);

  return {
    prevHymn,
    hymn,
    nextHymn,
    key,
  };
};

function transposeHymn(hymn: Hymn, key: HymnSearchParams["key"]): [Hymn & { scale: string }, number] {
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

export default function HymnPage() {
  const { hymn, nextHymn, prevHymn, key } = useLoaderData<typeof loader>();
  const ref = React.useRef<HTMLDivElement>(null);
  useFitTextToScreen(ref);

  const [transposedHymn, semitone] = transposeHymn(hymn, key);

  return (
    <div className="flex flex-col gap-8">
      <HymnCommandBar semitone={semitone} hymnKey={Chord.get(key ?? (transposedHymn.scale as any)).tonic as any} />

      <h3 className="text-3xl">
        {hymn.number}. {hymn.title}
      </h3>
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
              ← {prevHymn.number}. {prevHymn?.title}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col justify-end gap-2 text-end">
          {nextHymn ? (
            <a className="p-2 underline" href={`/hymn/${nextHymn.number}`}>
              {nextHymn.number}. {nextHymn.title} →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const getScreenHeight = () => {
  if (typeof window === "undefined") return 0;
  return window.innerHeight;
};

function useFitTextToScreen(ref: React.RefObject<HTMLElement>, initialFontSize = 16) {
  const fontSize = React.useRef(initialFontSize);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const fitTextToScreenHeight = debounce(() => {
      if (!ref.current) return;

      const container = ref.current;

      let lastFontSize: number | undefined;

      const adjustFontSizeRecursively = () => {
        const padding = 64;
        const screenHeight = getScreenHeight();
        const paddedHeight = screenHeight - padding;

        lastFontSize = fontSize.current;

        if (container.offsetHeight < paddedHeight) {
          fontSize.current += 0.5;
        } else if (container.offsetHeight > paddedHeight) {
          fontSize.current -= 0.5;
        }

        container.style.fontSize = fontSize.current + "px";

        requestAnimationFrame(() => {
          // Store the last good font size based on the direction of the changes
          const increasing = fontSize.current > lastFontSize!;
          if (increasing && container.offsetHeight > paddedHeight) {
            container.style.fontSize = lastFontSize + "px";
          } else {
            adjustFontSizeRecursively();
          }
        });
      };

      adjustFontSizeRecursively();
    }, 250);

    fitTextToScreenHeight();

    window.addEventListener("resize", fitTextToScreenHeight);

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

function HymnCommandBar({ semitone, hymnKey }: { semitone: number; hymnKey: HymnSearchParams["key"] }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex w-full items-center justify-between gap-4 text-lg sm:justify-center">
      <Select
        name="key"
        value={hymnKey}
        onValueChange={(value) => {
          navigate({
            search: addToSearchParams(searchParams, {
              key: value,
            }).toString(),
          });
        }}
      >
        <Select.Trigger className="w-[180px]">
          <Select.Value placeholder="Select a key" />
        </Select.Trigger>
        <Select.Content>
          {keys.map((key) => (
            <Select.Item key={key} value={key}>
              {key}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <div>Capo: {calculateCapoFret(semitone)}</div>
    </div>
  );
}
