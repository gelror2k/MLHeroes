import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loadJson, saveJson } from '@/services/storage';
import type { Hero } from '@/types/hero';

/**
 * Device-local favorites (no accounts, by design). Whole Hero objects are stored,
 * not just ids, so the Favorites tab renders without a network request.
 * A single provider at the root keeps the list and favorites tabs in sync.
 */
const STORAGE_KEY = 'favorites';

interface FavoritesValue {
  favorites: Hero[];
  hydrated: boolean; // false until AsyncStorage has been read once
  isFavorite: (heroId: number) => boolean;
  toggleFavorite: (hero: Hero) => void;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Hero[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadJson<Hero[]>(STORAGE_KEY).then((saved) => {
      if (cancelled) return;
      if (Array.isArray(saved)) setFavorites(saved);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const ids = useMemo(() => new Set(favorites.map((h) => h.hero_id)), [favorites]);

  const isFavorite = useCallback((heroId: number) => ids.has(heroId), [ids]);

  const toggleFavorite = useCallback((hero: Hero) => {
    setFavorites((current) => {
      const exists = current.some((h) => h.hero_id === hero.hero_id);
      // Strip skills so a favorite saved from the detail screen stays small.
      const { skills: _skills, ...slim } = hero;
      const next = exists ? current.filter((h) => h.hero_id !== hero.hero_id) : [...current, slim];
      saveJson(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, hydrated, isFavorite, toggleFavorite }),
    [favorites, hydrated, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return ctx;
}
