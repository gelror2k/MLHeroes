import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { heroEvents } from '@/services/hero-events';
import { getHero } from '@/services/heroService';
import type { Hero } from '@/types/hero';

/** The last response, tagged with the id it answers so `loading` can be derived. */
interface Loaded {
  id: number;
  hero: Hero | null;
  error: string | null;
}

const NOTHING: Loaded = { id: 0, hero: null, error: null };

/** One hero with skills, for the detail screen and the edit form. */
export function useHero(id: number) {
  const valid = Number.isInteger(id) && id > 0;
  const [data, setData] = useState<Loaded>(NOTHING);

  // Resolves to the state for this id; never throws, so callers just apply the result.
  const load = useCallback(
    () =>
      getHero(id).then(
        (res): Loaded => ({ id, hero: res.data, error: null }),
        (e): Loaded => ({ id, hero: null, error: getErrorMessage(e) }),
      ),
    [id],
  );

  useEffect(() => {
    if (!valid) return;
    let ignore = false;
    load().then((next) => {
      if (!ignore) setData(next);
    });
    return () => {
      ignore = true;
    };
  }, [load, valid]);

  useEffect(
    () =>
      heroEvents.subscribe((event) => {
        if (event.type === 'updated' && event.hero.hero_id === id) {
          // Keep skills from the last full load; the update response has none.
          setData((d) => (d.id === id && d.hero ? { ...d, hero: { ...event.hero, skills: d.hero.skills ?? [] } } : d));
        }
      }),
    [id],
  );

  const reload = useCallback(() => {
    setData(NOTHING);
    load().then(setData);
  }, [load]);

  if (!valid) return { hero: null, loading: false, error: 'Invalid hero id.', reload };
  const answered = data.id === id;
  return { hero: answered ? data.hero : null, loading: !answered, error: answered ? data.error : null, reload };
}
