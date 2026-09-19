import { ChakraPetch_500Medium, ChakraPetch_600SemiBold, ChakraPetch_700Bold } from '@expo-google-fonts/chakra-petch';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ToastProvider } from '@/components/toast';
import { Palette } from '@/constants/theme';
import { FavoritesProvider } from '@/hooks/use-favorites';

// Hold the splash until the two typefaces are ready so text never flashes in a system font.
SplashScreen.preventAutoHideAsync();

/** Navigation colours follow the palette so transitions never flash a foreign background. */
const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Palette.accent,
    background: Palette.background,
    card: Palette.backgroundBar,
    text: Palette.text,
    border: Palette.border,
    notification: Palette.accent,
  },
};

/** Root stack: the tab group, plus hero detail, the hero form and About pushed on top of it. */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ChakraPetch_500Medium,
    ChakraPetch_600SemiBold,
    ChakraPetch_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={NavigationTheme}>
      <FavoritesProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false, // every screen draws its own header from the design
              contentStyle: { backgroundColor: Palette.background },
            }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="hero/[id]" />
            <Stack.Screen name="hero/form" />
            <Stack.Screen name="about" />
          </Stack>
          <StatusBar style="light" />
        </ToastProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
