import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { difficultyColor, difficultyLevel } from '@/constants/roleColors';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STEPS = ['Easy', 'Medium', 'Hard'];

const HINTS: Record<string, string> = {
  Easy: 'Forgiving kit. Good first pick.',
  Medium: 'Needs timing and positioning.',
  Hard: 'High skill ceiling. Practice first.',
};

/** Three-segment meter: filled up to the hero's difficulty, in that difficulty's colour. */
export function DifficultyMeter({ difficulty }: { difficulty: string }) {
  const theme = useTheme();
  const level = difficultyLevel(difficulty);
  const color = difficultyColor(difficulty);

  return (
    <View style={styles.wrap} accessibilityLabel={`Difficulty ${difficulty}, ${level} of 3`}>
      <View style={styles.header}>
        <ThemedText type="bodyStrong" style={{ color }}>
          {difficulty}
        </ThemedText>
        <ThemedText type="caption" themeColor="textMuted">
          {HINTS[difficulty] ?? ''}
        </ThemedText>
      </View>
      <View style={styles.segments}>
        {STEPS.map((step, i) => (
          <View
            key={step}
            style={[styles.segment, { backgroundColor: i < level ? color : theme.surfaceRaised }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: Radius.pill,
  },
});
