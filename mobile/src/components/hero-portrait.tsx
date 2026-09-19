import { Image, type ImageStyle } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp } from 'react-native';

import { roleColor } from '@/constants/roleColors';
import type { Hero } from '@/types/hero';

type HeroPortraitProps = {
  hero: Pick<Hero, 'hero_id' | 'name' | 'picture' | 'roles'>;
  /** Sizing/border overrides; ImageStyle is a subset of ViewStyle so it fits the fallback View too. */
  style?: StyleProp<ImageStyle>;
  /** Font size of the fallback initial; scale with the portrait size. */
  initialSize?: number;
};

/**
 * Hero picture via expo-image, with a fallback tile showing the hero's initial.
 * `picture` URLs are external and may be dead or hotlink-blocked, so the fallback is not optional.
 */
export function HeroPortrait({ hero, style, initialSize = 40 }: HeroPortraitProps) {
  const [failed, setFailed] = useState(false);
  const accent = roleColor(hero.roles[0] ?? '');

  // A new hero (list recycling) gets a fresh attempt.
  useEffect(() => {
    setFailed(false);
  }, [hero.hero_id, hero.picture]);

  if (failed || !hero.picture) {
    return (
      <View style={[styles.base, styles.fallback, { backgroundColor: accent }, style]}>
        <Text style={[styles.initial, { fontSize: initialSize }]}>{hero.name.charAt(0).toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: hero.picture }}
      style={[styles.base, style]}
      contentFit="cover"
      transition={150}
      cachePolicy="disk"
      onError={() => setFailed(true)}
      accessibilityLabel={`${hero.name} portrait`}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2E3135',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#ffffff',
    fontWeight: 700,
  },
});
