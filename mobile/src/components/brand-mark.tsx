import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Gold shield tile + wordmark, used on the Home header and the About screen. */
export function BrandMark({ tagline = 'Land of Dawn' }: { tagline?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel={`MetaDex, ${tagline}`}>
      <View style={[styles.tile, { backgroundColor: theme.accent }]}>
        <Feather name="shield" size={22} color={theme.onAccent} />
      </View>
      <View style={styles.text}>
        <ThemedText type="title" style={styles.wordmark}>
          MetaDex
        </ThemedText>
        <ThemedText type="micro" themeColor="textMuted" style={styles.tagline}>
          {tagline}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    gap: 2,
  },
  wordmark: {
    fontSize: 21,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  tagline: {
    letterSpacing: 1.4,
  },
});
