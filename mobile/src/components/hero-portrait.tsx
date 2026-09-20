import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { roleColor } from '@/constants/roleColors';
import { Radius } from '@/constants/theme';
import { usePortraits } from '@/hooks/use-portraits';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type HeroPortraitProps = {
  hero: Pick<Hero, 'hero_id' | 'name' | 'picture' | 'roles'>;
  /** Show this image instead of the saved one ('' for none). The form preview passes its unsaved pick here. */
  uri?: string;
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
 * Square hero picture via expo-image. A photo picked on this device wins over the
 * `picture` URL. Falls back to a monogram tile in the hero's role colour because
 * `picture` URLs are external and may be dead or hotlink-blocked. Portraits are
 * tall (wiki art is 240x390), so the crop anchors to the top to keep the face.
 */
export function HeroPortrait({ hero, uri, size = 44, radius = Radius.md, style }: HeroPortraitProps) {
  const theme = useTheme();
  const { portraitFor } = usePortraits();
  const source = uri ?? portraitFor(hero.hero_id) ?? hero.picture;
  // Remember which URI failed so a recycled tile with a new hero gets a fresh attempt.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const failed = failedUri !== null && failedUri === source;
  const accent = roleColor(hero.roles[0] ?? '');

  const frame = [
    styles.frame,
    { width: size, height: size, borderRadius: radius, backgroundColor: theme.surfaceRaised, borderColor: theme.border },
    style,
  ];

  if (failed || !source) {
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
        source={{ uri: source }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
        transition={150}
        cachePolicy="disk"
        onError={() => setFailedUri(source)}
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
