import { create } from 'axios';

import type { HeroMeta, MetaSort, RawMetaRecord, RawMetaResponse } from '@/types/meta';

/**
 * The external third-party API: Moonton's GMS data API, the public backend behind
 * the official Mobile Legends: Bang Bang website's hero statistics. HTTPS, no key.
 *
 * Every query is a POST of `{ pageSize, pageIndex, filters, sorts }` to a numeric
 * "source". Source 2756569 is the ranked hero statistics for the last 7 days.
 *
 * We used to go through Rone Arena (arena.rone.dev), a community wrapper around
 * this same endpoint, but its domain vanished from DNS on 2026-09-25 (as its
 * predecessor mlbb-stats.ridwaanhall.com did before it). Calling the source
 * directly removes that middleman; the JSON is the same shape.
 *
 * Separate Axios instance on purpose: `api` in api/client.ts is bound to our PHP
 * backend's base URL and envelope; this one speaks a different JSON shape.
 */
export const META_API_BASE = 'https://api.gms.moontontech.com/api/gms/source/2669606';

/** Ranked window the numbers cover. */
export const META_DAYS = 7;
const HERO_STATS_7_DAYS = '/2756569';

/** "101" = all ranks; match_type "0" = the overall hero ranking (what the official site shows). */
const ALL_RANKS = [
  { field: 'bigrank', operator: 'eq', value: '101' },
  { field: 'match_type', operator: 'eq', value: '0' },
];

const SORT_FIELD: Record<MetaSort, string> = {
  win_rate: 'main_hero_win_rate',
  pick_rate: 'main_hero_appearance_rate',
  ban_rate: 'main_hero_ban_rate',
};

const meta = create({
  baseURL: META_API_BASE,
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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

async function queryStats(sort: MetaSort, size: number): Promise<HeroMeta[]> {
  const res = await meta.post<RawMetaResponse>(HERO_STATS_7_DAYS, {
    pageSize: size,
    pageIndex: 1,
    filters: ALL_RANKS,
    sorts: [{ data: { field: SORT_FIELD[sort], order: 'desc' }, type: 'sequence' }],
  });
  if (res.data.code !== 0) throw new Error(res.data.message || 'The stats service refused the request.');
  const list = res.data.data?.records ?? [];
  return list.map(toHeroMeta).filter((h): h is HeroMeta => h !== null);
}

/** Top heroes across all ranks over the last META_DAYS days, sorted by one rate, highest first. */
export function getTopHeroes(sort: MetaSort, size = 5): Promise<HeroMeta[]> {
  return queryStats(sort, size);
}

/** Every hero's numbers in one request (the game has ~130), shared by all profile screens. */
let roster: Promise<Map<string, HeroMeta>> | null = null;

function loadRoster(): Promise<Map<string, HeroMeta>> {
  if (!roster) {
    roster = queryStats('win_rate', 200).then((list) => new Map(list.map((h) => [heroKey(h.name), h])));
    // A failed load must not stick: the next profile (or Retry) asks again.
    roster.catch(() => {
      roster = null;
    });
  }
  return roster;
}

/**
 * One hero's ranked numbers, matched by name ignoring case, spaces and symbols,
 * so "Yi Sun-shin" and "X.Borg" work. Resolves to null when the game doesn't list
 * the hero, e.g. one an admin invented in our own database.
 */
export async function getHeroMeta(name: string, fresh = false): Promise<HeroMeta | null> {
  if (fresh) roster = null;
  const all = await loadRoster();
  return all.get(heroKey(name)) ?? null;
}

/** Matching rule for names across our roster and the game's, e.g. "Chang'e" -> "change". */
export function heroKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}
