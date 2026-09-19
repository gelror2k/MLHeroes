import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { getHero } from '@/services/heroService';
import type { Hero } from '@/types/hero';

/** One hero with skills, for the detail screen. */
export function useHero(id: number) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      setError('Invalid hero id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getHero(id);
      setHero(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { hero, loading, error, reload: load };
}
