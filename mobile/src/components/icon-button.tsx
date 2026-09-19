import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Sizes } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = keyof typeof Feather.glyphMap;

type IconButtonProps = {
  icon: IconName;
  /** Read by screen readers; icons alone say nothing. */
  label: string;
  onPress?: () => void;
  /** accent = gold outline for the one primary icon action on a screen. */
  tone?: 'default' | 'accent' | 'danger';
  /** Filled = the toggle is on (e.g. hero is saved). */
  active?: boolean;
  size?: number;
  iconSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** 44px square button from the design: 1px border, surface fill, single line icon. */
export function IconButton({
  icon,
  label,
  onPress,
  tone = 'default',
  active = false,
  size = Sizes.touch,
  iconSize = 20,
  disabled = false,
  style,
}: IconButtonProps) {
  const theme = useTheme();

  let background: string = theme.surface;
  let border: string = theme.border;
  let color: string = theme.textSecondary;
  if (tone === 'accent') {
    background = theme.accentSoft;
    border = theme.accent;
    color = theme.accent;
  } else if (tone === 'danger') {
    background = theme.dangerSoft;
    border = theme.dangerBorder;
    color = theme.danger;
  }
  if (active) {
    background = theme.accent;
    border = theme.accent;
    color = theme.onAccent;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: active }}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, backgroundColor: background, borderColor: border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Feather name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
