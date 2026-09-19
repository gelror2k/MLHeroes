import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { getFilters } from '@/services/heroService';
import { loadJson, saveJson } from '@/services/storage';
import type { Filters } from '@/types/hero';

const CACHE_KEY = 'filters';
const EMPTY: Filters = { roles: [], lanes: [], difficulties: [] };

type Outcome = { filters: Filters; error: null } | { filters: Filters | null; error: string };

/** Fetch, cache on success, fall back to the cache on failure. Never throws. */
function fetchFilters(): Promise<Outcome> {
  return getFilters().then(
    (res) => {
      saveJson(CACHE_KEY, res.data);
      return { filters: res.data, error: null };
    },
    async (e) => {
      const cached = await loadJson<Filters>(CACHE_KEY);
      return cached ? { filters: cached, error: null } : { filters: null, error: getErrorMessage(e) };
    },
  );
}

/**
 * Filter chip values from /api/filters.php, the single source of truth.
 * Serves the cached copy first so chips appear instantly, then refreshes from the API.
 */
export function useFilters() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [settled, setSettled] = useState(false); // the API has answered (or failed) once
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((outcome: Outcome) => {
    if (outcome.filters) setFilters(outcome.filters);
    setError(outcome.error);
    setSettled(true);
  }, []);

  useEffect(() => {
    let ignore = false;
    loadJson<Filters>(CACHE_KEY).then((cached) => {
      if (cached && !ignore) setFilters((current) => (current === EMPTY ? cached : current));
    });
    fetchFilters().then((outcome) => {
      if (!ignore) apply(outcome);
    });
    return () => {
      ignore = true;
    };
  }, [apply]);

  const reload = useCallback(() => {
    setSettled(false);
    setError(null);
    fetchFilters().then(apply);
  }, [apply]);

  return { filters, loading: !settled, error, reload };
}
