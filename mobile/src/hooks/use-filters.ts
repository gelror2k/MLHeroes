import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { getFilters } from '@/services/heroService';
import { loadJson, saveJson } from '@/services/storage';
import type { Filters } from '@/types/hero';

const CACHE_KEY = 'filters';
const EMPTY: Filters = { roles: [], lanes: [], difficulties: [] };

/**
 * Filter chip values from /api/filters.php, the single source of truth.
 * Serves the cached copy first so chips appear instantly, then refreshes from the API.
 */
export function useFilters() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFilters();
      setFilters(res.data);
      saveJson(CACHE_KEY, res.data);
    } catch (e) {
      const cached = await loadJson<Filters>(CACHE_KEY);
      if (cached) {
        setFilters(cached);
      } else {
        setError(getErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadJson<Filters>(CACHE_KEY).then((cached) => {
      if (cached && !cancelled) setFilters(cached);
    });
    load();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { filters, loading, error, reload: load };
}
