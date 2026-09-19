import { useCallback, useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { getHeroes } from '@/services/heroService';
import { loadJson, saveJson } from '@/services/storage';
import type { Hero, HeroQuery } from '@/types/hero';

const PER_PAGE = 20;
const CACHE_KEY = 'heroes-page1';

export interface HeroListState {
  heroes: Hero[];
  total: number;
  loading: boolean; // first page in flight, nothing to show yet
  loadingMore: boolean; // a later page in flight
  refreshing: boolean; // pull-to-refresh in flight
  error: string | null;
  hasMore: boolean;
  stale: boolean; // showing cached data because the request failed
}

type Mode = 'initial' | 'more' | 'refresh';

/**
 * Paginated hero list for the given filters. Re-fetches from page 1 whenever
 * the query changes; `loadMore` appends the next page; `refresh` reloads page 1.
 * Responses that arrive for an outdated query are ignored.
 */
export function useHeroes(query: Omit<HeroQuery, 'page' | 'per_page'>) {
  const [state, setState] = useState<HeroListState>({
    heroes: [],
    total: 0,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    hasMore: false,
    stale: false,
  });
  const pageRef = useRef(1);
  const requestId = useRef(0);

  const { search, role, lane, difficulty } = query;
  const isUnfiltered = !search && !role && !lane && !difficulty;

  const fetchPage = useCallback(
    async (page: number, mode: Mode) => {
      const id = ++requestId.current;
      setState((s) => ({
        ...s,
        loading: mode === 'initial',
        loadingMore: mode === 'more',
        refreshing: mode === 'refresh',
        error: null,
      }));

      try {
        const res = await getHeroes({ search, role, lane, difficulty, page, per_page: PER_PAGE });
        if (id !== requestId.current) return; // a newer request superseded this one
        const totalPages = res.meta?.total_pages ?? 1;
        pageRef.current = page;
        setState((s) => ({
          heroes: mode === 'more' ? [...s.heroes, ...res.data] : res.data,
          total: res.meta?.total ?? res.data.length,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: null,
          hasMore: page < totalPages,
          stale: false,
        }));
        if (page === 1 && isUnfiltered) saveJson(CACHE_KEY, res.data);
      } catch (e) {
        if (id !== requestId.current) return;
        const message = getErrorMessage(e);
        // First page, no filters: fall back to the last good copy if there is one.
        const cached = page === 1 && isUnfiltered ? await loadJson<Hero[]>(CACHE_KEY) : null;
        if (id !== requestId.current) return;
        const useCache = Boolean(cached && cached.length);
        setState((s) => ({
          ...s,
          heroes: useCache ? (cached as Hero[]) : mode === 'more' ? s.heroes : [],
          total: useCache ? (cached as Hero[]).length : mode === 'more' ? s.total : 0,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: useCache ? null : message,
          hasMore: false,
          stale: useCache,
        }));
      }
    },
    [search, role, lane, difficulty, isUnfiltered],
  );

  // Any change to the query restarts from page 1.
  useEffect(() => {
    fetchPage(1, 'initial');
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (state.loading || state.loadingMore || state.refreshing || !state.hasMore) return;
    fetchPage(pageRef.current + 1, 'more');
  }, [fetchPage, state.loading, state.loadingMore, state.refreshing, state.hasMore]);

  const refresh = useCallback(() => fetchPage(1, 'refresh'), [fetchPage]);
  const retry = useCallback(() => fetchPage(1, 'initial'), [fetchPage]);

  return { ...state, loadMore, refresh, retry };
}
