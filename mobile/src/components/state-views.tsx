import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * The three states every screen must handle: loading, error with retry, empty.
 * Kept together so they look the same everywhere.
 */

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.tint} />
      <ThemedText themeColor="textSecondary">{message}</ThemedText>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={theme.textSecondary} />
      <ThemedText type="subtitle" style={styles.title}>
        Couldn&apos;t load
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, { backgroundColor: theme.tint }, pressed && styles.pressed]}>
          <ThemedText style={styles.buttonLabel}>Try again</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyState({
  title,
  message,
  icon = 'search-outline',
}: {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.textSecondary} />
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {message && (
        <ThemedText themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 600,
  },
});
