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

/** Grid tile: portrait + bookmark on top, name, then role and difficulty in their colours. */
function HeroCardInner({ hero }: HeroCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const primaryRole = hero.roles[0] ?? '';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/hero/[id]', params: { id: String(hero.hero_id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${hero.name}, ${hero.roles.join(' and ')}, ${hero.difficulty}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.top}>
        <HeroPortrait hero={hero} size={56} />
        <FavoriteButton hero={hero} variant="bare" />
      </View>

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
    </Pressable>
  );
}

export const HeroCard = memo(HeroCardInner);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%', // a lone card on the last row keeps its column width
    padding: 13,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm + 2,
  },
  pressed: {
    opacity: 0.8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    flexShrink: 1,
    letterSpacing: 1,
  },
});
