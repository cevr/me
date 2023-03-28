export type Hymn = {
  title: string;
  number: string;
  reference: string;
  lines: {
    lyric: string;
    chord?: string;
  }[][];
};
