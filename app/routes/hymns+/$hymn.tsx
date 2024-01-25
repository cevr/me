import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { ChevronDown } from "lucide-react";
import { cacheHeader } from "pretty-cache-header";
import * as React from "react";
import { SelectValue } from "react-aria-components";

import { Label } from "~/components/label";
import { Select, SelectButton, SelectContent, SelectItem } from "~/components/select";
import { keys } from "~/lib/hymns";
import { getHymn, getHymnSearchParams, transposeHymn, type HymnSearchParams } from "~/lib/hymns.server";
import { addToSearchParams } from "~/lib/utils";

export let loader = async ({ params, request }: LoaderFunctionArgs) => {
  const number = params.hymn;
  if (!number) {
    throw new Error("hymnNumber is required");
  }
  const { sort, key } = getHymnSearchParams(request);

  const [prevHymn, hymn, nextHymn] = await getHymn(sort, number);
  const [transposedHymn, semitone] = transposeHymn(hymn, key);

  return json(
    {
      prevHymn,
      hymn: transposedHymn,
      nextHymn,
      key,
      semitone,
    },
    {
      headers: {
        "cache-control": cacheHeader({
          public: true,
          maxAge: "1year",
          staleWhileRevalidate: "1year",
        }),
      },
    },
  );
};

export default function HymnPage() {
  const { hymn, nextHymn, prevHymn, key, semitone } = useLoaderData<typeof loader>();
  const ref = React.useRef<HTMLDivElement>(null);
  useFitTextToScreen(ref);

  return (
    <div className="flex flex-col gap-8">
      <HymnCommandBar semitone={semitone} hymnKey={key ?? (hymn.scale as (typeof keys)[number])} />

      <div className="flex gap-4 items-center justify-between">
        <h3 className="text-2xl md:text-3xl">
          {hymn.number}. {hymn.title}
        </h3>
        <span className="text-xl md:text-2xl text-end">Capo: {calculateCapoFret(semitone)}</span>
      </div>
      <div className="flex flex-col gap-4" ref={ref}>
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
      <div className="flex w-full flex-col justify-between md:flex-row">
        <div className="flex flex-col gap-2">
          {prevHymn ? (
            <a className="p-2 underline" href={`/hymns/${prevHymn?.number}`}>
              ← {prevHymn.number}. {prevHymn?.title}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col justify-end gap-2 text-end">
          {nextHymn ? (
            <a className="p-2 underline" href={`/hymns/${nextHymn.number}`}>
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
  return window.visualViewport?.height ?? window.innerHeight;
};

function useFitTextToScreen(ref: React.RefObject<HTMLElement>) {
  const fontSize = React.useRef(20);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const fitTextToScreenHeight = debounce(() => {
      if (!ref.current) return;

      const container = ref.current;

      let lastFontSize: number | undefined;

      const adjustFontSizeRecursively = () => {
        const padding = 64;
        const screenHeight = getScreenHeight();
        const paddedHeight = screenHeight - padding * 2;

        lastFontSize = fontSize.current;

        if (container.offsetHeight < paddedHeight) {
          fontSize.current += 10;
        } else if (container.offsetHeight > paddedHeight) {
          fontSize.current -= 10;
        }

        container.style.fontSize = fontSize.current + "%";

        requestAnimationFrame(() => {
          // Store the last good font size based on the direction of the changes
          const increasing = fontSize.current > lastFontSize!;
          if (increasing && container.offsetHeight > paddedHeight) {
            container.style.fontSize = lastFontSize + "%";
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
    <div className="flex flex-col w-full gap-4 text-lg">
      <Select
        aria-label="Select a key"
        selectedKey={hymnKey}
        onSelectionChange={(value) => {
          navigate(
            {
              search: addToSearchParams(searchParams, {
                key: value as any,
              }).toString(),
            },
            {
              replace: true,
            },
          );
        }}
      >
        <Label className="text-base">Key</Label>
        <SelectButton variant="outline">
          <SelectValue>{({ selectedText }) => <span>{selectedText || "Select a key"}</span>}</SelectValue>
          <ChevronDown size="16" strokeWidth="3" />
        </SelectButton>
        <SelectContent>
          {keys.map((key) => (
            <SelectItem textValue={key} key={key} id={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
