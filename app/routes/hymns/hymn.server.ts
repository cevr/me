import type { Route } from './+types/hymn';
import { hymnsData } from './hymn.utils.server';
import type { Hymn } from './hymns.utils';

export function getHymnData({ params }: Route.LoaderArgs) {
  const hymnNumber = params.hymnId;
  const hymn = (hymnsData as Hymn[]).find((h) => h.number === hymnNumber);

  if (!hymn) {
    throw new Response('Hymn not found', { status: 404 });
  }

  // Find current hymn index and get prev/next
  const currentIndex = (hymnsData as Hymn[]).findIndex(
    (h) => h.number === hymnNumber,
  );
  const prevHymn =
    currentIndex > 0 ? (hymnsData as Hymn[])[currentIndex - 1] : null;
  const nextHymn =
    currentIndex < (hymnsData as Hymn[]).length - 1
      ? (hymnsData as Hymn[])[currentIndex + 1]
      : null;

  return {
    hymn,
    prevHymn: prevHymn
      ? { number: prevHymn.number, title: prevHymn.title }
      : null,
    nextHymn: nextHymn
      ? { number: nextHymn.number, title: nextHymn.title }
      : null,
  };
}
