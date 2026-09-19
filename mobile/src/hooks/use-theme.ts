import { Palette } from '@/constants/theme';

/**
 * The app ships one dark theme (app.json sets userInterfaceStyle to "dark"),
 * so this simply returns the palette. Kept as a hook so a light variant can be
 * added later without touching every component.
 */
export function useTheme() {
  return Palette;
}
