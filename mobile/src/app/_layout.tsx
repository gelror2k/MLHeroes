import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { FavoritesProvider } from '@/hooks/use-favorites';

/** Root stack: the tab group, plus the hero detail pushed on top of it. */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="hero/[id]" options={{ title: 'Hero', headerBackTitle: 'Back' }} />
        </Stack>
        <StatusBar style="auto" />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
