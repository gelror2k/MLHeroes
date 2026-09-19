import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { heroEvents } from '@/services/hero-events';
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

  useEffect(
    () =>
      heroEvents.subscribe((event) => {
        if (event.type === 'updated' && event.hero.hero_id === id) {
          // Keep skills from the last full load; the update response has none.
          setHero((current) => ({ ...event.hero, skills: current?.skills ?? [] }));
        }
      }),
    [id],
  );

  return { hero, loading, error, reload: load };
}
