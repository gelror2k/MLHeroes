import { useCallback, useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { heroEvents } from '@/services/hero-events';
import { getHeroes } from '@/services/heroService';
import { loadJson, saveJson } from '@/services/storage';
import type { Hero, HeroQuery } from '@/types/hero';

const PER_PAGE = 20;
const CACHE_KEY = 'heroes-page1';

export interface HeroListState {
  heroes: Hero[];
  total: number;
  loading: boolean; // first page for the current query in flight
  loadingMore: boolean; // a later page in flight
  refreshing: boolean; // pull-to-refresh in flight
  error: string | null;
  hasMore: boolean;
  stale: boolean; // showing cached data because the request failed
}

type Mode = 'initial' | 'more' | 'refresh';
type Query = Omit<HeroQuery, 'page' | 'per_page'>;

/** Everything that arrives with a response. `key` records which query it answers. */
interface Loaded {
  key: string;
  heroes: Hero[];
  total: number;
  hasMore: boolean;
  error: string | null;
  stale: boolean;
}

const NOTHING: Loaded = { key: '', heroes: [], total: 0, hasMore: false, error: null, stale: false };

/** The cached first page, plus the roster total it was a page of. */
type CachedPage = { heroes: Hero[]; total: number };

/** Older builds cached a bare Hero[]; read both shapes so an upgrade isn't a cache miss. */
function readCache(raw: Hero[] | CachedPage | null): CachedPage | null {
  if (!raw) return null;
  const page = Array.isArray(raw) ? { heroes: raw, total: raw.length } : raw;
  return page.heroes?.length ? page : null;
}

type PageOutcome =
  | { ok: true; heroes: Hero[]; total: number; hasMore: boolean }
  | { ok: false; error: string; cached: CachedPage | null };

/** One page of results. Never throws: a failure resolves with the cached first page, if any. */
function fetchPage(query: Query, page: number, useCacheOnError: boolean): Promise<PageOutcome> {
  return getHeroes({ ...query, page, per_page: PER_PAGE }).then(
    (res) => {
      const totalPages = res.meta?.total_pages ?? 1;
      const total = res.meta?.total ?? res.data.length;
      if (page === 1 && useCacheOnError) saveJson<CachedPage>(CACHE_KEY, { heroes: res.data, total });
      return { ok: true, heroes: res.data, total, hasMore: page < totalPages };
    },
    async (e) => {
      const raw = page === 1 && useCacheOnError ? await loadJson<Hero[] | CachedPage>(CACHE_KEY) : null;
      return { ok: false, error: getErrorMessage(e), cached: readCache(raw) };
    },
  );
}

/**
 * Does this hero still belong in the list the user is looking at? Mirrors what
 * heroes.php does server-side: substring on name/role/lane, exact on difficulty.
 * Used to drop a hero that an edit just moved out of the active filter.
 */
function matchesQuery(hero: Hero, query: Query): boolean {
  const has = (haystack: string, needle?: string) =>
    !needle || haystack.toLowerCase().includes(needle.toLowerCase());
  return (
    has(hero.name, query.search) &&
    has(hero.role, query.role) &&
    has(hero.lane, query.lane) &&
    (!query.difficulty || hero.difficulty.toLowerCase() === query.difficulty.toLowerCase())
  );
}

/** The API's ORDER BY name ASC, which is case-insensitive. */
function byName(a: Hero, b: Hero): number {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

/**
 * Append the next page, dropping heroes already on screen.
 *
 * LIMIT/OFFSET paging assumes the table does not move under it. Applying a
 * create or delete to the loaded list (see the heroEvents effect below) breaks
 * that assumption: an insert pushes every later row down by one, so the next
 * page repeats a hero the list already has — and duplicate keys make FlatList
 * misbehave. Filtering by id here makes the append idempotent.
 *
 * The mirror case, a delete pulling rows up so one hero falls between the pages
 * we fetched, cannot be repaired from the client. It is rare, harmless, and
 * pull-to-refresh restores it.
 */
function appendPage(loaded: Hero[], next: Hero[]): Hero[] {
  const seen = new Set(loaded.map((h) => h.hero_id));
  return [...loaded, ...next.filter((h) => !seen.has(h.hero_id))];
}

/**
 * Paginated hero list for the given filters. Re-fetches from page 1 whenever
 * the query changes; `loadMore` appends the next page; `refresh` reloads page 1.
 * `loading` is derived (the last response was for a different query), so no
 * state is written synchronously inside effects.
 */
export function useHeroes(query: Query) {
  const { search = '', role = '', lane = '', difficulty = '' } = query;
  const queryKey = [search, role, lane, difficulty].join('|');
  const isUnfiltered = queryKey === '|||';

  const [data, setData] = useState<Loaded>(NOTHING);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageRef = useRef(1);
  const requestId = useRef(0);

  /** Starts a request and returns a function that applies its outcome unless a newer one began. */
  const request = useCallback(
    (page: number, mode: Mode) => {
      const id = ++requestId.current;
      const apply = (outcome: PageOutcome) => {
        if (id !== requestId.current) return; // a newer request superseded this one
        setLoadingMore(false);
        setRefreshing(false);
        if (outcome.ok) {
          pageRef.current = page;
          setData((d) => ({
            key: queryKey,
            heroes: mode === 'more' ? appendPage(d.heroes, outcome.heroes) : outcome.heroes,
            total: outcome.total,
            hasMore: outcome.hasMore,
            error: null,
            stale: false,
          }));
        } else {
          const { cached, error } = outcome;
          setData((d) => ({
            key: queryKey,
            heroes: cached ? cached.heroes : mode === 'more' ? d.heroes : [],
            total: cached ? cached.total : mode === 'more' ? d.total : 0,
            hasMore: false,
            error: cached ? null : error,
            stale: Boolean(cached),
          }));
        }
      };
      return { promise: fetchPage({ search, role, lane, difficulty }, page, isUnfiltered), apply };
    },
    [search, role, lane, difficulty, queryKey, isUnfiltered],
  );

  // Any change to the query restarts from page 1.
  useEffect(() => {
    const { promise, apply } = request(1, 'initial');
    promise.then(apply);
  }, [request]);

  // A hero was created, edited or deleted somewhere in the app. Apply the change to
  // the pages already loaded rather than re-requesting page 1: a refetch would throw
  // away every page after the first and snap the user back to the top of the list.
  useEffect(() => {
    const query: Query = { search, role, lane, difficulty };
    return heroEvents.subscribe((event) => {
      setData((d) => {
        // Mid-reload for another query, or showing an error rather than a list.
        if (d.key !== queryKey || d.error) return d;

        if (event.type === 'deleted') {
          if (!d.heroes.some((h) => h.hero_id === event.heroId)) return d;
          return {
            ...d,
            heroes: d.heroes.filter((h) => h.hero_id !== event.heroId),
            total: Math.max(d.total - 1, 0),
          };
        }

        const hero = event.hero;
        const rest = d.heroes.filter((h) => h.hero_id !== hero.hero_id);
        const wasListed = rest.length !== d.heroes.length;

        // An edit can move a hero out of the active filter (Mage -> Tank while
        // filtering Mage), or into it.
        if (!matchesQuery(hero, query)) {
          return wasListed ? { ...d, heroes: rest, total: Math.max(d.total - 1, 0) } : d;
        }

        // A hero that sorts past everything loaded belongs to a page we have not
        // fetched yet, so only the count changes.
        const last = rest[rest.length - 1];
        if (!wasListed && d.hasMore && last && byName(hero, last) > 0) {
          return { ...d, total: d.total + 1 };
        }
        return { ...d, heroes: [...rest, hero].sort(byName), total: wasListed ? d.total : d.total + 1 };
      });
    });
  }, [search, role, lane, difficulty, queryKey]);

  const loading = data.key !== queryKey;
  const current = loading && data.error ? { ...data, error: null } : data;

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !data.hasMore) return;
    setLoadingMore(true);
    const { promise, apply } = request(pageRef.current + 1, 'more');
    promise.then(apply);
  }, [request, loading, loadingMore, refreshing, data.hasMore]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    const { promise, apply } = request(1, 'refresh');
    promise.then(apply);
  }, [request]);

  const retry = useCallback(() => {
    setData((d) => ({ ...d, key: '', error: null }));
    const { promise, apply } = request(1, 'initial');
    promise.then(apply);
  }, [request]);

  const state: HeroListState = {
    heroes: current.heroes,
    total: current.total,
    loading,
    loadingMore,
    refreshing,
    error: current.error,
    hasMore: current.hasMore,
    stale: current.stale,
  };

  return { ...state, loadMore, refresh, retry };
}
