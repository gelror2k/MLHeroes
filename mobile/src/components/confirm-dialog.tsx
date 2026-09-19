import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { HeroPortrait } from '@/components/hero-portrait';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  /** Shows the hero being acted on so the user can double-check before confirming. */
  hero?: Hero | null;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Destructive confirmation sheet from the design: dimmed page, centred card, red confirm. */
export function ConfirmDialog({
  visible,
  title,
  message,
  hero,
  confirmLabel = 'Delete',
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const skillCount = hero?.skills?.length ?? 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={busy ? undefined : onCancel}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={busy ? undefined : onCancel} accessibilityLabel="Dismiss" />
        <View
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.iconTile, { backgroundColor: theme.dangerSoft, borderColor: theme.dangerBorder }]}>
            <Feather name="trash-2" size={26} color={theme.danger} />
          </View>

          <ThemedText type="title" style={styles.center} accessibilityRole="header">
            {title}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {message}
          </ThemedText>

          {hero ? (
            <View style={[styles.heroRow, { backgroundColor: theme.surfaceRaised }]}>
              <HeroPortrait hero={hero} size={40} radius={Radius.sm} />
              <View style={styles.heroText}>
                <ThemedText type="bodyStrong" numberOfLines={1}>
                  {hero.name}
                </ThemedText>
                <ThemedText type="caption" themeColor="textMuted" numberOfLines={1}>
                  hero_id {hero.hero_id}
                  {skillCount > 0 ? ` · ${skillCount} skill row${skillCount === 1 ? '' : 's'}` : ''}
                </ThemedText>
              </View>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={onCancel} disabled={busy} style={styles.action} />
            <Pressable
              onPress={onConfirm}
              disabled={busy}
              accessibilityRole="button"
              accessibilityState={{ busy }}
              style={({ pressed }) => [
                styles.confirm,
                { backgroundColor: theme.danger },
                (pressed || busy) && styles.dim,
              ]}>
              <ThemedText type="bodyStrong" style={{ color: theme.onDanger }}>
                {busy ? 'Deleting…' : confirmLabel}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    padding: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  heroRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  action: {
    flex: 1,
  },
  confirm: {
    flex: 1,
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    opacity: 0.7,
  },
});
