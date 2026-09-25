import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BarRowProps = {
  label: string;
  /** 0..1 share of the track to fill. */
  ratio: number;
  value: string | number;
  color?: string;
  labelWidth?: number;
};

/** Label · track · value, the horizontal bar used for breakdowns. */
export function BarRow({ label, ratio, value, color, labelWidth = 74 }: BarRowProps) {
  const theme = useTheme();
  const pct = Math.round(Math.min(Math.max(ratio, 0), 1) * 100);
  return (
    <View style={styles.row} accessibilityLabel={`${label}: ${value}`}>
      {label ? (
        <ThemedText type="small" themeColor="textSecondary" style={{ width: labelWidth }} numberOfLines={1}>
          {label}
        </ThemedText>
      ) : null}
      <View style={[styles.track, { backgroundColor: theme.surfaceRaised }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color ?? theme.accent }]} />
      </View>
      <ThemedText type="numeral" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  value: {
    width: 46,
    textAlign: 'right',
  },
});
