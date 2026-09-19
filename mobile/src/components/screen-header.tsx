import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { ThemedText } from '@/components/themed-text';
import { Gutter, Spacing } from '@/constants/theme';

type ScreenHeaderProps = {
  title?: string;
  /** Show a back (chevron) or close (x) button that pops the stack. */
  back?: 'chevron' | 'close';
  backLabel?: string;
  onBack?: () => void;
  /** Buttons or badges on the right, laid out in a row. */
  right?: ReactNode;
  /** Replaces the title text entirely (e.g. the brand mark on Home). */
  children?: ReactNode;
};

/** In-screen header: 44px controls either side of a Chakra Petch title. */
export function ScreenHeader({ title, back, backLabel = 'Go back', onBack, right, children }: ScreenHeaderProps) {
  const router = useRouter();
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <View style={styles.row}>
      {back ? <IconButton icon={back === 'close' ? 'x' : 'chevron-left'} label={backLabel} onPress={goBack} /> : null}
      <View style={styles.titleWrap}>
        {children ?? (
          <ThemedText type="title" numberOfLines={1}>
            {title}
          </ThemedText>
        )}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Gutter,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  titleWrap: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
