import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  /** Accent colour. Tints the background when idle and fills it when selected. */
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Rounded pill used for role/lane/difficulty tags and for filter buttons. */
export function Chip({ label, color, selected = false, onPress, small = false, style }: ChipProps) {
  const theme = useTheme();
  const accent = color ?? theme.tint;
  const background = selected ? accent : theme.backgroundElement;
  const textColor = selected ? '#ffffff' : color ? accent : theme.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      style={({ pressed }) => [
        styles.chip,
        small && styles.small,
        { backgroundColor: background, borderColor: selected ? accent : theme.border },
        pressed && onPress ? styles.pressed : null,
        style,
      ]}>
      <Text style={[styles.label, small && styles.smallLabel, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  small: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  smallLabel: {
    fontSize: 11,
  },
});
