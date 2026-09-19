import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/** Search box with a clear button. Debouncing is the caller's job (see use-debounced-value). */
export function SearchInput({ value, onChangeText, placeholder = 'Search heroes' }: SearchInputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Ionicons name="search" size={18} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search heroes by name"
        style={[styles.input, { color: theme.text }]}
      />
      {value !== '' && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});
