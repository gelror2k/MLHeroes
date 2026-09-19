import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Sizes } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  label: string;
  /** Grey helper line under the input. */
  hint?: string;
  /** Red line under the input; also colours the border. Only pass once the field was touched. */
  error?: string | null;
};

/** Labelled 48px input from the design. Border turns gold on focus, red on error. */
export function TextField({ label, hint, error, style, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? theme.danger : focused ? theme.accent : theme.border;

  return (
    <View style={styles.field}>
      <ThemedText type="eyebrow" themeColor="textMuted" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        placeholderTextColor={theme.textMuted}
        accessibilityLabel={label}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor }, style]}
        {...inputProps}
      />
      {error ? (
        <ThemedText type="caption" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText type="caption" themeColor="textMuted">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 7,
  },
  label: {
    letterSpacing: 1.1,
  },
  input: {
    height: Sizes.input,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
});
