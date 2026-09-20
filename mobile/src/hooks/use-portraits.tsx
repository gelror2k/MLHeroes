import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { heroEvents } from '@/services/hero-events';
import {
  copyPortrait,
  deletePortraitFile,
  loadPortraits,
  portraitUri,
  savePortraits,
  type PortraitMap,
} from '@/services/portraits';

/**
 * Device-local hero photos keyed by hero id (see services/portraits.ts).
 * Like favorites this lives on the phone only, with one provider at the root
 * so every HeroPortrait updates the moment a photo is picked or removed.
 */
interface PortraitsValue {
  /** file:// URI of the photo stored for this hero, or null if there is none. */
  portraitFor: (heroId: number) => string | null;
  /** Copy a picked image into app storage and use it for this hero. Rejects if the copy fails. */
  setPortrait: (heroId: number, sourceUri: string) => Promise<void>;
  clearPortrait: (heroId: number) => void;
}

const PortraitsContext = createContext<PortraitsValue | null>(null);

export function PortraitsProvider({ children }: { children: ReactNode }) {
  const [portraits, setPortraits] = useState<PortraitMap>({});

  useEffect(() => {
    let cancelled = false;
    loadPortraits().then((saved) => {
      if (!cancelled) setPortraits(saved);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearPortrait = useCallback((heroId: number) => {
    const key = String(heroId);
    setPortraits((current) => {
      const gone = current[key];
      if (gone === undefined) return current;
      const next = { ...current };
      delete next[key];
      deletePortraitFile(gone);
      savePortraits(next);
      return next;
    });
  }, []);

  const setPortrait = useCallback(async (heroId: number, sourceUri: string) => {
    const name = await copyPortrait(heroId, sourceUri);
    const key = String(heroId);
    setPortraits((current) => {
      const previous = current[key];
      if (previous !== undefined && previous !== name) deletePortraitFile(previous);
      const next = { ...current, [key]: name };
      savePortraits(next);
      return next;
    });
  }, []);

  // The photo goes with the record.
  useEffect(
    () =>
      heroEvents.subscribe((event) => {
        if (event.type === 'deleted') clearPortrait(event.heroId);
      }),
    [clearPortrait],
  );

  const uris = useMemo(() => {
    const out = new Map<number, string>();
    for (const [id, name] of Object.entries(portraits)) out.set(Number(id), portraitUri(name));
    return out;
  }, [portraits]);

  const portraitFor = useCallback((heroId: number) => uris.get(heroId) ?? null, [uris]);

  const value = useMemo(() => ({ portraitFor, setPortrait, clearPortrait }), [portraitFor, setPortrait, clearPortrait]);

  return <PortraitsContext.Provider value={value}>{children}</PortraitsContext.Provider>;
}

export function usePortraits(): PortraitsValue {
  const ctx = useContext(PortraitsContext);
  if (!ctx) {
    throw new Error('usePortraits must be used inside <PortraitsProvider>');
  }
  return ctx;
}
