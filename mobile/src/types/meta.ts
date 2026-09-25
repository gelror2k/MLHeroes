/**
 * Live ranked statistics from the third-party MLBB data API (api.gms.moontontech.com),
 * Moonton's public data backend for Mobile Legends: Bang Bang. Nothing here is stored in
 * our database; it is fetched on demand and shown as-is.
 */

/** Which rate the Home leaderboard is sorted by. Mapped to the API's sort fields in metaService. */
export type MetaSort = 'win_rate' | 'pick_rate' | 'ban_rate';

/** One hero's ranked numbers, flattened out of the API's nested record. Rates are 0..1. */
export interface HeroMeta {
  /** The game's own hero id, not our `hero_id`. */
  gameHeroId: number;
  name: string;
  /** Square head icon from Moonton's CDN; '' when the record has none. */
  head: string;
  winRate: number;
  pickRate: number;
  banRate: number;
}

/** Raw shape of one record in `data.records[]`, only the fields we read. */
export interface RawMetaRecord {
  data?: {
    main_heroid?: number;
    main_hero?: { data?: { name?: string; head?: string } };
    main_hero_win_rate?: number;
    main_hero_appearance_rate?: number;
    main_hero_ban_rate?: number;
  };
}

/** Raw envelope: `{ code: 0, message: "OK", data: { records: [...] } }`. */
export interface RawMetaResponse {
  code?: number;
  message?: string;
  data?: { records?: RawMetaRecord[] };
}
