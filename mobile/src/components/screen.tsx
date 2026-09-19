import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Which notches to pad. Tabs handle the bottom, so screens default to top only. */
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

/** Full-height page background with safe-area padding. Every route starts with this. */
export function Screen({ children, edges = ['top'], style }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.screen, { backgroundColor: theme.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
