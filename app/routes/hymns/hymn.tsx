import { Link, useLoaderData, useSearchParams } from 'react-router';
import { Chord, transpose } from 'tonal';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import type { Route } from './+types/hymn';
import { HymnCombobox } from './hymn-combobox';
import { getHymnData } from './hymn.server';
import type { Hymn } from './hymns.utils';

type HymnLine = Array<{ lyric: string; chord: string }>;

export let loader = getHymnData;

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `${data?.hymn.number}. ${data?.hymn.title} | Hymnal` }];
}

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Convert semitones to interval string for tonal library
function semitonesToInterval(semitones: number): string {
  const intervals = [
    '1P',
    '2m',
    '2M',
    '3m',
    '3M',
    '4P',
    '4A',
    '5P',
    '6m',
    '6M',
    '7m',
    '7M',
  ];

  if (semitones === 0) return '1P';

  const absSteps = Math.abs(semitones);
  const octaves = Math.floor(absSteps / 12);
  const remainder = absSteps % 12;

  let interval = intervals[remainder];
  if (octaves > 0) {
    interval = `${octaves + 1}${interval.slice(1)}`;
  }

  return semitones < 0 ? `-${interval}` : interval;
}

function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord.trim() === '') return chord;

  try {
    const interval = semitonesToInterval(semitones);
    return transpose(chord, interval);
  } catch (error) {
    // If transposition fails, return original chord
    console.warn(`Could not transpose chord: ${chord}`, error);
    return chord;
  }
}

function getOriginalKey(hymn: Hymn): string {
  // Try to determine the original key from the first chord
  for (const line of hymn.lines) {
    for (const segment of line) {
      if (segment.chord && segment.chord.trim() !== '') {
        const chordObj = Chord.get(segment.chord);
        if (chordObj.root) {
          return chordObj.root;
        }
        // Fallback: assume it's a simple note
        const simpleChord = segment.chord.replace(/[^A-G#b]/g, '');
        if (KEYS.includes(simpleChord)) {
          return simpleChord;
        }
      }
    }
  }
  return 'C'; // Default fallback
}

export default function Hymn() {
  const { hymn, prevHymn, nextHymn } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const originalKey = getOriginalKey(hymn);
  const currentKey = searchParams.get('key') || originalKey;

  // Calculate semitones difference
  const originalKeyIndex = KEYS.indexOf(originalKey);
  const currentKeyIndex = KEYS.indexOf(currentKey);
  const semitones = currentKeyIndex - originalKeyIndex;

  const handleKeyChange = (newKey: string) => {
    if (newKey === originalKey) {
      setSearchParams({});
    } else {
      setSearchParams({ key: newKey });
    }
  };

  const transposeHymnLine = (line: HymnLine): HymnLine => {
    return line.map((segment) => ({
      ...segment,
      chord: transposeChord(segment.chord, semitones),
    }));
  };

  return (
    <div className="mx-auto max-w-2xl p-8 font-mono">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-8">
          <Link
            to="/hymns"
            className="hover:text-primary inline-block text-sm hover:underline"
          >
            ← Back to Hymns
          </Link>

          <div>
            <h1 className="text-2xl font-light tracking-tight">
              {hymn.number}. {hymn.title}
            </h1>
          </div>

          {/* Hymn Combobox */}

          <HymnCombobox selectedHymnNumber={hymn.number} />

          {/* Key Selector */}
          <div className="flex items-center gap-2 text-sm">
            <Select
              value={currentKey}
              onValueChange={(value) => handleKeyChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                {KEYS.map((key) => (
                  <SelectItem
                    key={key}
                    value={key}
                  >
                    {key} {key === originalKey ? '(Original)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentKey !== originalKey && (
            <div className="text-sm text-gray-600">
              Capo (fret {semitones < 0 ? 12 + semitones : semitones})
            </div>
          )}
        </div>

        {/* Hymn Content */}
        <div className="flex flex-col gap-8">
          {hymn.lines.map((line, lineIndex) => {
            const transposedLine = transposeHymnLine(line);

            return (
              <div
                key={lineIndex}
                className="flex flex-wrap gap-2"
              >
                {transposedLine.map((segment, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className="flex flex-col"
                  >
                    <span className="text-primary min-h-[1rem] shrink-0 font-mono text-xs leading-tight">
                      {segment.chord || '\u00A0'}
                    </span>
                    <span className="flex-1 leading-tight">
                      {segment.lyric}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Reference */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">{hymn.reference}</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <div className="empty:hidden sm:empty:block">
            {prevHymn && (
              <Link
                to={`/hymns/${prevHymn.number}`}
                className="hover:text-primary flex min-w-0 items-center gap-2 text-sm hover:underline"
              >
                <span>←</span>
                <div className="flex min-w-0 gap-1">
                  <span className="shrink-0 font-mono">{prevHymn.number}.</span>
                  <span className="min-w-0 truncate">{prevHymn.title}</span>
                </div>
              </Link>
            )}
          </div>
          <div className="flex justify-end self-end sm:self-auto">
            {nextHymn && (
              <Link
                to={`/hymns/${nextHymn.number}`}
                className="hover:text-primary flex min-w-0 flex-row-reverse items-center gap-2 text-sm hover:underline"
              >
                <span>→</span>
                <div className="flex min-w-0 gap-1 text-right">
                  <span className="shrink-0 font-mono">{nextHymn.number}.</span>
                  <span className="min-w-0 truncate">{nextHymn.title}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
