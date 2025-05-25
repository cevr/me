export type Hymn = {
  title: string;
  number: string;
  reference: string;
  lines: Array<Array<{ lyric: string; chord: string }>>;
};
