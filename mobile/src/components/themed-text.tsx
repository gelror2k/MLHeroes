import { StyleSheet, Text, type FontVariant, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Type scale, all Inter. Large sizes get slightly negative tracking, numbers use
 * tabular figures so columns of stats line up. Labels are sentence case: the only
 * uppercase text left is what the data itself spells that way.
 * Pick a variant instead of setting fontSize/fontFamily inline.
 */
export type TextVariant =
  | 'display' // screen hero name, 28
  | 'title' // screen title, 24
  | 'heading' // card headline, 19
  | 'cardTitle' // card / tile title, 16
  | 'stat' // big number in a stat tile, 24
  | 'statSmall' // number in a small tile, 17
  | 'numeral' // number beside a bar, 13
  | 'body' // 15
  | 'bodyStrong'
  | 'small' // 13
  | 'smallStrong'
  | 'caption' // 13, secondary text
  | 'eyebrow' // 13, semibold label (tags, field labels, small headers)
  | 'micro' // 12, medium, tile and meta labels
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: TextVariant;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const tabular: FontVariant[] = ['tabular-nums'];

const styles = StyleSheet.create({
  display: { fontFamily: Fonts.display, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  title: { fontFamily: Fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.5 },
  heading: { fontFamily: Fonts.displaySemi, fontSize: 19, lineHeight: 25, letterSpacing: -0.3 },
  cardTitle: { fontFamily: Fonts.displaySemi, fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  stat: { fontFamily: Fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.5, fontVariant: tabular },
  statSmall: { fontFamily: Fonts.displaySemi, fontSize: 17, lineHeight: 22, letterSpacing: -0.2, fontVariant: tabular },
  numeral: { fontFamily: Fonts.displaySemi, fontSize: 13, lineHeight: 18, fontVariant: tabular },
  body: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: Fonts.bodySemi, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: Fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  smallStrong: { fontFamily: Fonts.bodySemi, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19 },
  eyebrow: { fontFamily: Fonts.bodySemi, fontSize: 13, lineHeight: 18 },
  micro: { fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
  code: { fontFamily: Fonts.mono, fontSize: 12, lineHeight: 18 },
});
