/**
 * One fixed colour per role so the list is scannable at a glance.
 * Keys must match the role strings the API returns (from filters.php).
 * Unknown roles fall back to neutral grey rather than breaking.
 */
export const RoleColors: Record<string, string> = {
  Tank: '#3B82F6',
  Fighter: '#F97316',
  Assassin: '#8B5CF6',
  Mage: '#EC4899',
  Marksman: '#EAB308',
  Support: '#22C55E',
};

export const FallbackRoleColor = '#6B7280';

export function roleColor(role: string): string {
  return RoleColors[role] ?? FallbackRoleColor;
}

export const DifficultyColors: Record<string, string> = {
  Easy: '#22C55E',
  Medium: '#F59E0B',
  Hard: '#EF4444',
};

export function difficultyColor(difficulty: string): string {
  return DifficultyColors[difficulty] ?? FallbackRoleColor;
}
