import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SectionCardProps = {
  /** Card title in the top-left, e.g. "Role distribution". */
  title?: string;
  /** Small text or a link on the top-right. */
  aside?: ReactNode;
  children: ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/** The dashboard card: 16px padding, 12px radius, 1px border, optional title row. */
export function SectionCard({ title, aside, children, gap = Spacing.md + 2, style }: SectionCardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, gap }, style]}>
      {title || aside ? (
        <View style={styles.header}>
          {title ? (
            <ThemedText type="cardTitle">
              {title}
            </ThemedText>
          ) : (
            <View />
          )}
          {aside}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
});
