import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Type scale. Display sizes and numbers use Chakra Petch; everything you read
 * uses Manrope. Pick a variant instead of setting fontSize/fontFamily inline.
 */
export type TextVariant =
  | 'display' // screen hero name, 28
  | 'title' // screen title, 22
  | 'heading' // card headline, 20
  | 'cardTitle' // list tile name, 16
  | 'stat' // big number in a stat tile, 23
  | 'statSmall' // number in a small tile, 16
  | 'numeral' // number beside a bar, 13
  | 'body' // 15
  | 'bodyStrong'
  | 'small' // 13
  | 'smallStrong'
  | 'caption' // 12, long-form secondary text
  | 'eyebrow' // 11, uppercase, letter-spaced section label
  | 'micro' // 10, uppercase, tile label
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: TextVariant;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: { fontFamily: Fonts.display, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: Fonts.display, fontSize: 22, lineHeight: 28 },
  heading: { fontFamily: Fonts.display, fontSize: 20, lineHeight: 26 },
  cardTitle: { fontFamily: Fonts.displaySemi, fontSize: 16, lineHeight: 21 },
  stat: { fontFamily: Fonts.display, fontSize: 23, lineHeight: 28 },
  statSmall: { fontFamily: Fonts.display, fontSize: 16, lineHeight: 20 },
  numeral: { fontFamily: Fonts.display, fontSize: 13, lineHeight: 18 },
  body: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: Fonts.bodySemi, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: Fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  smallStrong: { fontFamily: Fonts.bodyBold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18 },
  eyebrow: { fontFamily: Fonts.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.3, textTransform: 'uppercase' },
  micro: { fontFamily: Fonts.bodySemi, fontSize: 10, lineHeight: 13, letterSpacing: 1, textTransform: 'uppercase' },
  code: { fontFamily: Fonts.mono, fontSize: 12, lineHeight: 18 },
});
