import { api } from '@/api/client';
import type { ApiResponse, Filters, Hero, HeroQuery } from '@/types/hero';

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
