import type { Hero } from '@/types/hero';

/**
 * Minimal in-app notifier for hero writes. The service layer emits after a
 * successful create/update/delete; hooks subscribe so the list, detail and
 * favorites screens update without a global store.
 */
export type HeroEvent =
  | { type: 'created'; hero: Hero }
  | { type: 'updated'; hero: Hero }
  | { type: 'deleted'; heroId: number };

type Listener = (event: HeroEvent) => void;

const listeners = new Set<Listener>();

export const heroEvents = {
  emit(event: HeroEvent): void {
    listeners.forEach((fn) => fn(event));
  },
  /** Returns the unsubscribe function, for use directly in a useEffect. */
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
