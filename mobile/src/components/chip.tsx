import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { withAlpha } from '@/constants/roleColors';
import { Radius, Sizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  /**
   * filter = 44px pill that toggles (gold when selected).
   * tag = small uppercase label with a soft tint of `color`, for role/lane/difficulty on cards.
   */
  variant?: 'filter' | 'tag';
  /** Accent colour for the tag tint or the selected filter fill. Defaults to gold. */
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, variant = 'filter', color, selected = false, onPress, style }: ChipProps) {
  const theme = useTheme();

  if (variant === 'tag') {
    const accent = color ?? theme.textSecondary;
    return (
      <View style={[styles.tag, { backgroundColor: color ? withAlpha(accent, 0.16) : theme.surfaceRaised }, style]}>
        <ThemedText type="eyebrow" style={[styles.tagLabel, { color: accent }]} numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
    );
  }

  const accent = color ?? theme.accent;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.filter,
        selected
          ? { backgroundColor: accent, borderColor: accent }
          : { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
        style,
      ]}>
      {color && !selected ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
      <ThemedText
        type="smallStrong"
        style={{ color: selected ? theme.onAccent : theme.textSecondary }}
        numberOfLines={1}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: Sizes.touch,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    alignSelf: 'flex-start',
  },
  tagLabel: {
    letterSpacing: 0.8,
  },
});
