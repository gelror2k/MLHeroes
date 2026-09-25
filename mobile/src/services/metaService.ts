import { create, isAxiosError } from 'axios';

import type { HeroMeta, MetaSort, RawMetaRecord, RawMetaResponse } from '@/types/meta';

/**
 * The external third-party API: Rone Arena, an unofficial community API for
 * Mobile Legends: Bang Bang ranked data. Public, HTTPS, no key.
 * Docs: https://arena.rone.dev/api/docs
 *
 * Separate Axios instance on purpose: `api` in api/client.ts is bound to our PHP
 * backend's base URL and envelope; this one speaks a different JSON shape.
 */
export const META_API_BASE = 'https://arena.rone.dev/api';
export const META_API_DOCS = 'https://arena.rone.dev/api/docs';

/** Ranked window the numbers cover. The API accepts 1, 3, 7, 15 or 30. */
export const META_DAYS = 7;

const meta = create({
  baseURL: META_API_BASE,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

/** Pull the fields we show out of one nested record; null when it isn't a usable hero row. */
function toHeroMeta(record: RawMetaRecord): HeroMeta | null {
  const d = record.data;
  const name = d?.main_hero?.data?.name;
  if (!d || typeof name !== 'string' || name === '') return null;
  return {
    gameHeroId: d.main_heroid ?? 0,
    name,
    head: d.main_hero?.data?.head ?? '',
    winRate: d.main_hero_win_rate ?? 0,
    pickRate: d.main_hero_appearance_rate ?? 0,
    banRate: d.main_hero_ban_rate ?? 0,
  };
}

function records(body: RawMetaResponse): HeroMeta[] {
  const list = body.data?.records ?? [];
  return list.map(toHeroMeta).filter((h): h is HeroMeta => h !== null);
}

/** Top heroes across all ranks over the last META_DAYS days, sorted by one rate, highest first. */
export async function getTopHeroes(sort: MetaSort, size = 5): Promise<HeroMeta[]> {
  const res = await meta.get<RawMetaResponse>('/heroes/rank', {
    params: { days: String(META_DAYS), rank: 'all', sort_field: sort, sort_order: 'desc', size, index: 1 },
  });
  return records(res.data);
}

/**
 * One hero's ranked numbers, looked up by name (the API ignores case, spaces and
 * symbols, so "Yi Sun-shin" and "X.Borg" work). Resolves to null when the API
 * doesn't know the hero, e.g. one an admin invented in our own database.
 */
export async function getHeroMeta(name: string): Promise<HeroMeta | null> {
  try {
    const res = await meta.get<RawMetaResponse>(`/heroes/${encodeURIComponent(name)}/stats`, {
      params: { rank: 'all', size: 1 },
    });
    return records(res.data)[0] ?? null;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) return null;
    throw e;
  }
}

/** Same matching rule the API uses, so a leaderboard name can be found in our roster. */
export function heroKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}
