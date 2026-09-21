import { useCallback, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { heroEvents } from '@/services/hero-events';
import { getAllHeroes } from '@/services/heroService';
import { loadJson, saveJson } from '@/services/storage';
import type { Hero } from '@/types/hero';

const CACHE_KEY = 'heroes-all';

type Cached = { heroes: Hero[]; total: number; updatedAt: number };

export type CountRow = { label: string; count: number };

interface Roster {
  heroes: Hero[];
  total: number;
  updatedAt: number | null;
  error: string | null;
  stale: boolean; // showing the cached copy because the request failed
  settled: boolean; // the API has answered (or failed) at least once
}

const NOTHING: Roster = { heroes: [], total: 0, updatedAt: null, error: null, stale: false, settled: false };

type Outcome = { ok: true; data: Cached } | { ok: false; error: string; cached: Cached | null };

/** Whole roster; caches on success, falls back to the cache on failure. Never throws. */
function fetchRoster(): Promise<Outcome> {
  return getAllHeroes().then(
    ({ heroes, total }) => {
      const data = { heroes, total, updatedAt: Date.now() };
      saveJson<Cached>(CACHE_KEY, data);
      return { ok: true, data };
    },
    async (e) => {
      const cached = await loadJson<Cached>(CACHE_KEY);
      return { ok: false, error: getErrorMessage(e), cached: cached && cached.heroes.length > 0 ? cached : null };
    },
  );
}

/** The API's ORDER BY name ASC, which is case-insensitive. */
function byName(a: Hero, b: Hero): number {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

function countBy(heroes: Hero[], pick: (hero: Hero) => string[]): CountRow[] {
  const counts = new Map<string, number>();
  for (const hero of heroes) {
    for (const key of pick(hero)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

/** Day of year, so the spotlight hero changes daily but stays put within a day. */
function dayIndex(): number {
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), 0, 0);
  return Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - start) / 86_400_000);
}

/**
 * Whole-roster view for the Home dashboard: role/lane/difficulty counts and a
 * daily spotlight hero. Serves the cached copy first, then refreshes from the API.
 */
export function useDashboard() {
  const [roster, setRoster] = useState<Roster>(NOTHING);
  const [refreshing, setRefreshing] = useState(false);

  const apply = useCallback((outcome: Outcome) => {
    setRefreshing(false);
    if (outcome.ok) {
      setRoster({ ...outcome.data, error: null, stale: false, settled: true });
      return;
    }
    setRoster((r) => {
      // Prefer the cached copy, then whatever was already on screen, before showing an error.
      const fallback = outcome.cached ?? (r.heroes.length > 0 ? r : null);
      return {
        heroes: fallback?.heroes ?? [],
        total: fallback?.total ?? 0,
        updatedAt: fallback?.updatedAt ?? null,
        error: fallback ? null : outcome.error,
        stale: Boolean(fallback),
        settled: true,
      };
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    loadJson<Cached>(CACHE_KEY).then((cached) => {
      if (ignore || !cached || cached.heroes.length === 0) return;
      // Only fill the gap while nothing better has arrived.
      setRoster((r) => (r.heroes.length === 0 ? { ...r, ...cached, stale: true } : r));
    });
    fetchRoster().then((outcome) => {
      if (!ignore) apply(outcome);
    });
    return () => {
      ignore = true;
    };
  }, [apply]);

  // A hero was created, edited or deleted somewhere in the app. This hook holds the
  // whole unfiltered roster, so every count can be recomputed from the list already
  // in memory — re-paging all 133 heroes over the network just to change one row is
  // three requests for nothing. The event carries the server's own response, so the
  // hero is already canonicalised.
  useEffect(
    () =>
      heroEvents.subscribe((event) => {
        setRoster((r) => {
          if (r.heroes.length === 0) return r; // nothing loaded yet; the fetch will cover it
          let heroes: Hero[];
          if (event.type === 'deleted') {
            heroes = r.heroes.filter((h) => h.hero_id !== event.heroId);
            if (heroes.length === r.heroes.length) return r;
          } else {
            heroes = [...r.heroes.filter((h) => h.hero_id !== event.hero.hero_id), event.hero].sort(byName);
          }
          const next: Cached = { heroes, total: heroes.length, updatedAt: r.updatedAt ?? Date.now() };
          saveJson<Cached>(CACHE_KEY, next);
          return { ...r, ...next };
        });
      }),
    [],
  );

  const { heroes } = roster;
  const roles = useMemo(() => countBy(heroes, (h) => h.roles), [heroes]);
  const lanes = useMemo(() => countBy(heroes, (h) => h.lanes), [heroes]);
  const difficulties = useMemo(() => countBy(heroes, (h) => [h.difficulty]), [heroes]);
  const spotlight = useMemo(() => (heroes.length > 0 ? heroes[dayIndex() % heroes.length] : null), [heroes]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchRoster().then(apply);
  }, [apply]);

  const retry = useCallback(() => {
    setRoster((r) => ({ ...r, settled: false, error: null }));
    fetchRoster().then(apply);
  }, [apply]);

  return {
    heroes,
    total: roster.total,
    updatedAt: roster.updatedAt,
    error: roster.error,
    stale: roster.stale,
    loading: !roster.settled && heroes.length === 0,
    refreshing,
    roles,
    lanes,
    difficulties,
    spotlight,
    refresh,
    retry,
  };
}
