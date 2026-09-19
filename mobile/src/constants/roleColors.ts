/**
 * One fixed colour per role so the roster is scannable at a glance.
 * Keys must match the role strings the API returns (from filters.php).
 * Unknown roles fall back to the muted text colour rather than breaking.
 */
import { Palette } from '@/constants/theme';

export const RoleColors: Record<string, string> = {
  Tank: '#4C9AFF',
  Fighter: '#FF7A59',
  Assassin: '#C06BFF',
  Mage: '#4ED0C0',
  Marksman: '#EE6FA8',
  Support: '#7BE08A',
};

export const FallbackRoleColor = Palette.textMuted;

export function roleColor(role: string): string {
  return RoleColors[role] ?? FallbackRoleColor;
}

export const DifficultyColors: Record<string, string> = {
  Easy: Palette.success,
  Medium: Palette.accent,
  Hard: Palette.danger,
};

export function difficultyColor(difficulty: string): string {
  return DifficultyColors[difficulty] ?? FallbackRoleColor;
}

/** 1-based rank used for the difficulty meter; unknown values show an empty meter. */
export function difficultyLevel(difficulty: string): number {
  return { Easy: 1, Medium: 2, Hard: 3 }[difficulty] ?? 0;
}

/** Hex colour + alpha (0-1) -> rgba string, for the soft tinted chip backgrounds. */
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
