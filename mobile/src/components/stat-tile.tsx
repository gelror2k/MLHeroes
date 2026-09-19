import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatTileProps = {
  value: string | number;
  label: string;
  /** Colour of the number; gold marks the one figure the user "owns" (e.g. SAVED). */
  tone?: ThemeColor;
  /** Raised tiles sit inside a card; default tiles sit on the page. */
  raised?: boolean;
  /** Center the text (used for the small tiles inside the spotlight card). */
  centered?: boolean;
};

/** Big number over a tiny uppercase label. Three of these make the dashboard's stat row. */
export function StatTile({ value, label, tone = 'text', raised = false, centered = false }: StatTileProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.tile,
        raised
          ? { backgroundColor: theme.surfaceRaised }
          : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
        raised && styles.raised,
        centered && styles.centered,
      ]}>
      <ThemedText type={raised ? 'statSmall' : 'stat'} themeColor={tone} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </ThemedText>
      <ThemedText type="micro" themeColor="textMuted" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: 3,
  },
  raised: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm - 2,
    borderRadius: Radius.sm,
  },
  centered: {
    alignItems: 'center',
  },
});
