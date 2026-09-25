import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/api/client';
import { getHeroMeta, getTopHeroes } from '@/services/metaService';
import type { HeroMeta, MetaSort } from '@/types/meta';

/**
 * Hooks over the third-party ranked-stats API. Same pattern as use-hero: each
 * answer is tagged with the request it belongs to, and `loading` is derived
 * from "no answer for the current key yet" instead of being set in an effect.
 */

interface Answer<T> {
  key: string;
  value: T;
  error: string | null;
}

/** Top 5 heroes by the chosen rate, for the Home leaderboard. */
export function useTopHeroes(sort: MetaSort) {
  const [data, setData] = useState<Answer<HeroMeta[]> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = `${sort}#${attempt}`;

  useEffect(() => {
    let ignore = false;
    getTopHeroes(sort).then(
      (value) => !ignore && setData({ key, value, error: null }),
      (e) => !ignore && setData({ key, value: [], error: getErrorMessage(e) }),
    );
    return () => {
      ignore = true;
    };
  }, [sort, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const answered = data?.key === key;
  return {
    heroes: answered ? data.value : [],
    loading: !answered,
    error: answered ? data.error : null,
    retry,
  };
}

/** One hero's ranked numbers for the profile; `hero` is null when the API doesn't list them. */
export function useHeroMeta(name: string | undefined) {
  const [data, setData] = useState<Answer<HeroMeta | null> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = `${name ?? ''}#${attempt}`;

  useEffect(() => {
    if (!name) return;
    let ignore = false;
    getHeroMeta(name).then(
      (value) => !ignore && setData({ key, value, error: null }),
      (e) => !ignore && setData({ key, value: null, error: getErrorMessage(e) }),
    );
    return () => {
      ignore = true;
    };
  }, [name, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const answered = data?.key === key;
  return {
    hero: answered ? data.value : null,
    loading: !!name && !answered,
    error: answered ? data.error : null,
    retry,
  };
}
