import Constants from 'expo-constants';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.section, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

/** Credits, data source, and the disclaimer the project plan calls for. */
export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'not configured';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle">MLHeroes</ThemedText>
          <ThemedText themeColor="textSecondary">Mobile Legends: Bang Bang hero reference</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Version {version}
          </ThemedText>
        </View>

        <Section title="What it does">
          <ThemedText>
            Browse every hero, filter by role, lane and difficulty, search by name, and save favorites. Favorites
            are stored on this device only; there is no account.
          </ThemedText>
        </Section>

        <Section title="Where the data comes from">
          <ThemedText>
            Hero records live in a MySQL database and are served by a small PHP API. Filter options are read from
            the data itself, so new roles or lanes appear automatically.
          </ThemedText>
          <ThemedText type="code" themeColor="textSecondary" selectable>
            {apiUrl}
          </ThemedText>
        </Section>

        <Section title="Built with">
          <ThemedText>Expo, React Native, TypeScript, Expo Router, Axios</ThemedText>
          <ThemedText>PHP with PDO, MySQL</ThemedText>
        </Section>

        <Section title="Disclaimer">
          <ThemedText type="small" themeColor="textSecondary">
            Mobile Legends: Bang Bang, hero names and artwork are the property of Moonton. This is an unofficial,
            non-commercial student project and is not affiliated with or endorsed by Moonton.
          </ThemedText>
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  section: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
