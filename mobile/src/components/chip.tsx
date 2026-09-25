import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { withAlpha } from '@/constants/roleColors';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  /**
   * filter = 38px pill that toggles (gold when selected), 46px touch area with the slop.
   * tag = small uppercase label with a soft tint of `color`, for role/lane/difficulty on cards.
   */
  variant?: 'filter' | 'tag';
  /** Accent colour for the tag tint or the selected filter fill. Defaults to gold. */
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** 38px pill plus 4px of invisible slop above and below keeps the touch target over 44px. */
const CHIP_SLOP = { top: 4, bottom: 4 };

export function Chip({ label, variant = 'filter', color, selected = false, onPress, style }: ChipProps) {
  const theme = useTheme();

  if (variant === 'tag') {
    const accent = color ?? theme.textSecondary;
    return (
      <View style={[styles.tag, { backgroundColor: color ? withAlpha(accent, 0.16) : theme.surfaceRaised }, style]}>
        <ThemedText type="eyebrow" style={{ color: accent }} numberOfLines={1}>
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
      hitSlop={CHIP_SLOP}
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
    height: 38,
    paddingHorizontal: 14,
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
});
