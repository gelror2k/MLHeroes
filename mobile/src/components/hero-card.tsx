import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FavoriteButton } from '@/components/favorite-button';
import { HeroPortrait } from '@/components/hero-portrait';
import { ThemedText } from '@/components/themed-text';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type HeroCardProps = {
  hero: Hero;
};

/** Card height of the portrait strip. Wiki portraits are tall, so the crop keeps the face. */
const PORTRAIT_HEIGHT = 148;

/** Grid tile: full-width portrait with the bookmark in its corner, then name, role and difficulty. */
function HeroCardInner({ hero }: HeroCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const primaryRole = hero.roles[0] ?? '';

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/hero/[id]',
          params: { id: String(hero.hero_id) },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`${hero.name}, ${hero.roles.join(' and ')}, ${hero.difficulty}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View>
        <HeroPortrait hero={hero} size={PORTRAIT_HEIGHT} radius={0} style={styles.portrait} />
        <FavoriteButton hero={hero} variant="bare" style={[styles.bookmark, { backgroundColor: theme.overlay }]} />
      </View>

      <View style={styles.body}>
        <ThemedText type="cardTitle" numberOfLines={1}>
          {hero.name}
        </ThemedText>

        <View style={styles.meta}>
          <ThemedText type="micro" style={[styles.metaText, { color: roleColor(primaryRole) }]} numberOfLines={1}>
            {hero.roles.join(' / ')}
          </ThemedText>
          <ThemedText type="micro" themeColor="textMuted" style={styles.metaText}>
            {' · '}
          </ThemedText>
          <ThemedText type="micro" style={[styles.metaText, { color: difficultyColor(hero.difficulty) }]}>
            {hero.difficulty}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

export const HeroCard = memo(HeroCardInner);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%', // a lone card on the last row keeps its column width
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  portrait: {
    width: '100%',
    borderWidth: 0,
  },
  bookmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.md,
    gap: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    flexShrink: 1,
  },
});
