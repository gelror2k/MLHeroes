/**
 * Shapes returned by the PHP API. Mirrors the table plus the pre-split
 * arrays the API adds, so the app never parses "Mage/Tank" itself.
 */

export interface ApiMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Skill {
  skill_id: number;
  slot: 'passive' | 'skill1' | 'skill2' | 'ultimate';
  name: string;
  description: string | null;
  cooldown: string | null;
  mana_cost: string | null;
  icon_url: string | null;
}

export interface Hero {
  hero_id: number;
  name: string;
  role: string; // raw column, e.g. "Mage/Tank"
  roles: string[]; // split by the API
  lane: string;
  lanes: string[];
  difficulty: string; // "Easy" | "Medium" | "Hard" by convention, but typed loosely on purpose
  picture: string;
  skills?: Skill[]; // only present from /api/hero.php
}

export interface Filters {
  roles: string[];
  lanes: string[];
  difficulties: string[];
}

/** Fields the API accepts when creating or updating a hero. */
export interface HeroInput {
  name: string;
  role: string; // "Mage/Tank" style, same as the column
  lane: string;
  difficulty: string;
  picture: string;
}

/** Query parameters accepted by /api/heroes.php. All optional. */
export interface HeroQuery {
  search?: string;
  role?: string;
  lane?: string;
  difficulty?: string;
  page?: number;
  per_page?: number;
}
