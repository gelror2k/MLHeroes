import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/components/icon-button';
import { ThemedText } from '@/components/themed-text';
import { Radius, Sizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** primary = solid gold. secondary = surface + border. danger = soft red. */
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Compact 44px height for inline rows (record cards); default is the 50px bar button. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Full-width text button used in bottom action bars and dialogs. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  compact = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const palette = {
    primary: { bg: theme.accent, border: theme.accent, fg: theme.onAccent },
    secondary: { bg: theme.surface, border: theme.border, fg: theme.textSecondary },
    danger: { bg: theme.dangerSoft, border: theme.dangerBorder, fg: theme.danger },
  }[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border, height: compact ? Sizes.touch : Sizes.button },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={compact ? 16 : 18} color={palette.fg} /> : null}
          <ThemedText type={variant === 'primary' ? 'bodyStrong' : 'smallStrong'} style={[{ color: palette.fg }, !compact && styles.label]}>
            {label}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
});
