import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type RingSegment = {
  label: string;
  value: number;
  color: string;
};

type RoleRingProps = {
  segments: RingSegment[];
  /** Number printed in the middle (the hero total, not the segment sum). */
  centerValue: number;
  centerLabel?: string;
  size?: number;
  thickness?: number;
};

const GAP = 3; // px of track showing between segments

/** Donut made of stroked circles; each segment is a dash on the same ring. */
export function RoleRing({ segments, centerValue, centerLabel = 'Heroes', size = 152, thickness = 16 }: RoleRingProps) {
  const theme = useTheme();
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const sum = segments.reduce((acc, s) => acc + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  const arcs: (RingSegment & { len: number; offset: number })[] = [];
  let offset = 0;
  for (const s of visible) {
    const full = (s.value / sum) * circumference;
    const len = Math.max(full - (visible.length > 1 ? GAP : 0), 0);
    arcs.push({ ...s, len, offset });
    offset += full;
  }

  const summary = visible.map((s) => `${s.label} ${s.value}`).join(', ');

  return (
    <View style={{ width: size, height: size }} accessibilityRole="image" accessibilityLabel={`Role distribution: ${summary}`}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={-90} origin={`${c}, ${c}`}>
          <Circle cx={c} cy={c} r={r} stroke={theme.surfaceRaised} strokeWidth={thickness} fill="none" />
          {arcs.map((a) => (
            <Circle
              key={a.label}
              cx={c}
              cy={c}
              r={r}
              stroke={a.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${a.len} ${circumference - a.len}`}
              strokeDashoffset={-a.offset}
            />
          ))}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <ThemedText type="stat" style={styles.value}>
          {centerValue}
        </ThemedText>
        <ThemedText type="micro" themeColor="textMuted" style={styles.label}>
          {centerLabel}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 27,
    lineHeight: 32,
  },
  label: {
    letterSpacing: 1.6,
  },
});
