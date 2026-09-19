import { adminHeaders, api } from '@/api/client';
import { heroEvents } from '@/services/hero-events';
import type { ApiResponse, Filters, Hero, HeroInput, HeroQuery } from '@/types/hero';

/**
 * All API calls live here. Components and hooks call these; nothing else touches Axios.
 * Every function resolves to the full ApiResponse so callers can read `meta`.
 */

export async function getHeroes(query: HeroQuery = {}): Promise<ApiResponse<Hero[]>> {
  // Drop empty strings so the URL stays clean and the API's "no filter" path is used.
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.role) params.role = query.role;
  if (query.lane) params.lane = query.lane;
  if (query.difficulty) params.difficulty = query.difficulty;
  if (query.page) params.page = query.page;
  if (query.per_page) params.per_page = query.per_page;

  const res = await api.get<ApiResponse<Hero[]>>('/heroes.php', { params });
  return res.data;
}

export async function getHero(id: number): Promise<ApiResponse<Hero>> {
  const res = await api.get<ApiResponse<Hero>>('/hero.php', { params: { id } });
  return res.data;
}

export async function getFilters(): Promise<ApiResponse<Filters>> {
  const res = await api.get<ApiResponse<Filters>>('/filters.php');
  return res.data;
}

// ---- Writes (need the admin key) ------------------------------------------
// Each one announces the change through heroEvents so open screens refresh.

export async function createHero(input: HeroInput): Promise<ApiResponse<Hero>> {
  const res = await api.post<ApiResponse<Hero>>('/heroes.php', input, { headers: adminHeaders() });
  heroEvents.emit({ type: 'created', hero: res.data.data });
  return res.data;
}

export async function updateHero(id: number, input: Partial<HeroInput>): Promise<ApiResponse<Hero>> {
  const res = await api.put<ApiResponse<Hero>>('/hero.php', input, { params: { id }, headers: adminHeaders() });
  heroEvents.emit({ type: 'updated', hero: res.data.data });
  return res.data;
}

export async function deleteHero(id: number): Promise<ApiResponse<{ hero_id: number }>> {
  const res = await api.delete<ApiResponse<{ hero_id: number }>>('/hero.php', {
    params: { id },
    headers: adminHeaders(),
  });
  heroEvents.emit({ type: 'deleted', heroId: id });
  return res.data;
}
