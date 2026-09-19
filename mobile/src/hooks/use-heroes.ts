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

type Mode = 'initial' | 'more' | 'refresh' | 'silent';
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

type PageOutcome =
  | { ok: true; heroes: Hero[]; total: number; hasMore: boolean }
  | { ok: false; error: string; cached: Hero[] | null };

/** One page of results. Never throws: a failure resolves with the cached first page, if any. */
function fetchPage(query: Query, page: number, useCacheOnError: boolean): Promise<PageOutcome> {
  return getHeroes({ ...query, page, per_page: PER_PAGE }).then(
    (res) => {
      const totalPages = res.meta?.total_pages ?? 1;
      if (page === 1 && useCacheOnError) saveJson(CACHE_KEY, res.data);
      return { ok: true, heroes: res.data, total: res.meta?.total ?? res.data.length, hasMore: page < totalPages };
    },
    async (e) => {
      const cached = page === 1 && useCacheOnError ? await loadJson<Hero[]>(CACHE_KEY) : null;
      return { ok: false, error: getErrorMessage(e), cached: cached && cached.length ? cached : null };
    },
  );
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
            heroes: mode === 'more' ? [...d.heroes, ...outcome.heroes] : outcome.heroes,
            total: outcome.total,
            hasMore: outcome.hasMore,
            error: null,
            stale: false,
          }));
        } else {
          const { cached, error } = outcome;
          setData((d) => ({
            key: queryKey,
            heroes: cached ?? (mode === 'more' ? d.heroes : []),
            total: cached ? cached.length : mode === 'more' ? d.total : 0,
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

  // A hero was created, edited or deleted somewhere in the app: reload quietly.
  useEffect(
    () =>
      heroEvents.subscribe(() => {
        const { promise, apply } = request(1, 'silent');
        promise.then(apply);
      }),
    [request],
  );

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
