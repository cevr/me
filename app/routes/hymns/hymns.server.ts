import { hymnsData } from './hymn.utils.server';
import type { Hymn } from './hymns.utils';

export function getHymns() {
  return { hymns: hymnsData as Hymn[] };
}
