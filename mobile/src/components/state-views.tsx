import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import type { IconName } from '@/components/icon-button';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * The three states every screen must handle: loading, error with retry, empty.
 * Kept together so they look the same everywhere.
 */

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={theme.accent} />
      <ThemedText type="small" themeColor="textMuted">
        {message}
      </ThemedText>
    </View>
  );
}

function IconTile({ icon, tone }: { icon: IconName; tone: 'muted' | 'danger' }) {
  const theme = useTheme();
  const danger = tone === 'danger';
  return (
    <View
      style={[
        styles.iconTile,
        danger
          ? { backgroundColor: theme.dangerSoft, borderColor: theme.dangerBorder }
          : { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <Feather name={icon} size={26} color={danger ? theme.danger : theme.textMuted} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <IconTile icon="wifi-off" tone="danger" />
      <ThemedText type="title" style={styles.title}>
        Couldn&apos;t load
      </ThemedText>
      <ThemedText type="body" themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {onRetry && <Button label="Try again" icon="refresh-cw" onPress={onRetry} style={styles.button} />}
    </View>
  );
}

export function EmptyState({
  title,
  message,
  icon = 'search',
  action,
}: {
  title: string;
  message?: string;
  icon?: IconName;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.container}>
      <IconTile icon={icon} tone="muted" />
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      {message && (
        <ThemedText type="body" themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      )}
      {action && <Button label={action.label} variant="secondary" onPress={action.onPress} style={styles.button} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    marginTop: Spacing.sm,
    minWidth: 180,
  },
});
