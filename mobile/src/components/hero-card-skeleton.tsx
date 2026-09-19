import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Card-shaped placeholder that pulses while the first page loads, so the grid doesn't jump. */
export function HeroCardSkeleton() {
  const theme = useTheme();
  const [pulse] = useState(() => new Animated.Value(0.45));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const block = { backgroundColor: theme.surfaceRaised };

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pulse }]}>
      <View style={styles.top}>
        <View style={[styles.portrait, block]} />
        <View style={[styles.icon, block]} />
      </View>
      <View style={[styles.name, block]} />
      <View style={[styles.meta, block]} />
    </Animated.View>
  );
}

/** Two-column grid of skeletons; `count` should be even. */
export function HeroGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <HeroCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 13,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm + 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portrait: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  name: {
    width: '70%',
    height: 14,
    borderRadius: 4,
  },
  meta: {
    width: '50%',
    height: 10,
    borderRadius: 4,
  },
});
