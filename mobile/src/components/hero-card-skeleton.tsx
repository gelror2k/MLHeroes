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
      <View style={[styles.portrait, block]} />
      <View style={styles.body}>
        <View style={[styles.name, block]} />
        <View style={[styles.meta, block]} />
      </View>
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
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  portrait: {
    height: 148, // matches PORTRAIT_HEIGHT in hero-card
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.md + 2,
    gap: Spacing.sm,
  },
  name: {
    width: '70%',
    height: 15,
    borderRadius: 4,
  },
  meta: {
    width: '50%',
    height: 10,
    borderRadius: 4,
  },
});
