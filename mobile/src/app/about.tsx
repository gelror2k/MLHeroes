import Constants from 'expo-constants';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SectionCard } from '@/components/section-card';
import { ThemedText } from '@/components/themed-text';
import { Gutter, Spacing } from '@/constants/theme';

/** Credits, data source, and the disclaimer the project plan calls for. */
export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'not configured';

  return (
    <Screen>
      <ScreenHeader back="chevron" backLabel="Back to home" title="About" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <BrandMark tagline={`Version ${version}`} />
          <ThemedText type="body" themeColor="textSecondary">
            An unofficial Mobile Legends: Bang Bang hero reference.
          </ThemedText>
        </View>

        <SectionCard title="What it does" gap={Spacing.sm}>
          <ThemedText type="body" themeColor="textSecondary">
            Browse every hero, filter by role, lane and difficulty, search by name, and save heroes for quick
            access. Saved heroes live on this device only; there is no account.
          </ThemedText>
        </SectionCard>

        <SectionCard title="Where the data comes from" gap={Spacing.sm}>
          <ThemedText type="body" themeColor="textSecondary">
            Hero records live in a MySQL database and are served by a small PHP API. Filter options are read from
            the data itself, so new roles or lanes appear automatically.
          </ThemedText>
          <ThemedText type="code" themeColor="textMuted" selectable>
            {apiUrl}
          </ThemedText>
        </SectionCard>

        <SectionCard title="Built with" gap={Spacing.xs}>
          <ThemedText type="body" themeColor="textSecondary">
            Expo, React Native, TypeScript, Expo Router, Axios
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary">
            PHP with PDO, MySQL
          </ThemedText>
          <ThemedText type="caption" themeColor="textMuted" style={styles.fonts}>
            Type set in Chakra Petch and Manrope.
          </ThemedText>
        </SectionCard>

        <SectionCard title="Disclaimer" gap={Spacing.sm}>
          <ThemedText type="caption" themeColor="textMuted">
            Mobile Legends: Bang Bang, hero names and artwork are the property of Moonton. This is an unofficial,
            non-commercial student project and is not affiliated with or endorsed by Moonton.
          </ThemedText>
        </SectionCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  brand: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  fonts: {
    marginTop: Spacing.xs,
  },
});
