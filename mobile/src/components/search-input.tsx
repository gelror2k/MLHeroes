import { Feather } from '@expo/vector-icons';
import type { Ref } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Fonts, Radius, Sizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchInputProps = Pick<TextInputProps, 'autoFocus' | 'onSubmitEditing' | 'returnKeyType'> & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  /** Lets a parent focus the field, e.g. when arriving from the Home search box. */
  ref?: Ref<TextInput>;
};

/** 48px search field with a leading icon and a clear button. Debouncing is the caller's job. */
export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search hero name',
  accessibilityLabel = 'Search heroes by name',
  ref,
  ...inputProps
}: SearchInputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Feather name="search" size={18} color={theme.textMuted} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel={accessibilityLabel}
        style={[styles.input, { color: theme.text }]}
        {...inputProps}
      />
      {value !== '' && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
          <Feather name="x" size={18} color={theme.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: Sizes.input,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    paddingVertical: 0,
  },
});
