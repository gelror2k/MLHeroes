import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { roleColor } from '@/constants/roleColors';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type HeroPortraitProps = {
  hero: Pick<Hero, 'hero_id' | 'name' | 'picture' | 'roles'>;
  /** Square edge in px. */
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** "Lancelot" -> "LA". Two letters read better than one at tile sizes. */
export function monogram(name: string): string {
  const letters = name.replace(/[^a-z0-9]/gi, '');
  return (letters.length >= 2 ? letters.slice(0, 2) : letters || '?').toUpperCase();
}

/**
 * Square hero picture via expo-image. Falls back to a monogram tile in the hero's
 * role colour because `picture` URLs are external and may be dead or hotlink-blocked.
 */
export function HeroPortrait({ hero, size = 44, radius = Radius.md, style }: HeroPortraitProps) {
  const theme = useTheme();
  // Remember which URL failed so a recycled tile with a new hero gets a fresh attempt.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const failed = failedUri !== null && failedUri === hero.picture;
  const accent = roleColor(hero.roles[0] ?? '');

  const frame = [
    styles.frame,
    { width: size, height: size, borderRadius: radius, backgroundColor: theme.surfaceRaised, borderColor: theme.border },
    style,
  ];

  if (failed || !hero.picture) {
    return (
      <View style={frame} accessibilityLabel={`${hero.name} portrait placeholder`}>
        <ThemedText type="stat" style={{ color: accent, fontSize: Math.round(size * 0.34), lineHeight: Math.round(size * 0.42) }}>
          {monogram(hero.name)}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={frame}>
      <Image
        source={{ uri: hero.picture }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
        cachePolicy="disk"
        onError={() => setFailedUri(hero.picture)}
        accessibilityLabel={`${hero.name} portrait`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
