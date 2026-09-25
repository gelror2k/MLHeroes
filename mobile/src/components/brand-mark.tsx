import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

/** Wordmark + tagline for the Home header. */
export function BrandMark({ tagline = 'Land of Dawn' }: { tagline?: string }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel={`MetaDex, ${tagline}`}>
      <View style={styles.text}>
        <ThemedText type="title" style={styles.wordmark}>
          MetaDex
        </ThemedText>
        <ThemedText type="micro" themeColor="textMuted">
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
  text: {
    gap: 2,
  },
  wordmark: {
    fontSize: 20,
    lineHeight: 24,
  },
});
