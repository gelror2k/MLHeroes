/**
 * Design tokens for the MetaDex look: a single dark palette, two typefaces
 * (Chakra Petch for display/numbers, Manrope for reading), and a 4-point
 * spacing scale. Every screen and component pulls from here; nothing is
 * hardcoded at the call site.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  background: '#080B15', // page
  backgroundBar: '#0D1020', // tab bar, sticky action bars
  surface: '#141A2A', // cards, inputs
  surfaceRaised: '#1B2336', // tiles inside cards, bar tracks, monogram tiles
  border: '#2A3550',

  text: '#E8ECF5',
  textSecondary: '#C9D3E8',
  textMuted: '#9AA7C2',

  accent: '#F5B841', // gold: primary actions, active tab, selected chip
  onAccent: '#080B15',
  accentSoft: 'rgba(245,184,65,0.14)',
  accentBorder: 'rgba(245,184,65,0.34)',

  info: '#8FA6FF',
  infoSoft: 'rgba(76,111,255,0.14)',
  infoBorder: 'rgba(76,111,255,0.34)',

  danger: '#FF6B6B',
  onDanger: '#1A0A0C',
  dangerSoft: 'rgba(255,107,107,0.08)',
  dangerBorder: 'rgba(255,107,107,0.34)',

  success: '#7BE08A',
  successSoft: 'rgba(123,224,138,0.14)',
  warning: '#FF9F5A',

  overlay: 'rgba(4,7,14,0.84)',
} as const;

export type ThemeColor = keyof typeof Palette;

/**
 * Font family names as registered by expo-font in the root layout.
 * React Native needs one family name per weight for custom fonts, so weight
 * is chosen here rather than through `fontWeight`.
 */
export const Fonts = {
  display: 'ChakraPetch_700Bold',
  displaySemi: 'ChakraPetch_600SemiBold',
  displayMedium: 'ChakraPetch_500Medium',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  mono: Platform.select({ ios: 'ui-monospace', web: 'var(--font-mono)', default: 'monospace' }) as string,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 10,
  pill: 999,
} as const;

/** Fixed control sizes from the design: 44 is the minimum touch target. */
export const Sizes = {
  touch: 44,
  input: 48,
  button: 50,
} as const;

/** Shared horizontal gutter so headers, lists and bars line up. */
export const Gutter = Spacing.xl;
