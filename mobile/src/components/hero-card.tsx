import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { FavoriteButton } from '@/components/favorite-button';
import { HeroPortrait } from '@/components/hero-portrait';
import { ThemedText } from '@/components/themed-text';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type HeroCardProps = {
  hero: Hero;
};

/** Grid tile: portrait, name, role chips, difficulty. Tapping opens the detail screen. */
function HeroCardInner({ hero }: HeroCardProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/hero/[id]', params: { id: String(hero.hero_id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${hero.name}, ${hero.role}, ${hero.difficulty}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View>
        <HeroPortrait hero={hero} />
        <View style={[styles.difficulty, { backgroundColor: difficultyColor(hero.difficulty) }]}>
          <ThemedText style={styles.difficultyText}>{hero.difficulty}</ThemedText>
        </View>
        <FavoriteButton hero={hero} size={20} style={[styles.heart, { backgroundColor: theme.background }]} />
      </View>

      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {hero.name}
        </ThemedText>
        <View style={styles.chips}>
          {hero.roles.map((role) => (
            <Chip key={role} label={role} color={roleColor(role)} small />
          ))}
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {hero.lanes.join(' / ')}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export const HeroCard = memo(HeroCardInner);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  difficulty: {
    position: 'absolute',
    left: Spacing.two,
    bottom: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: 700,
  },
  heart: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    opacity: 0.92,
  },
  body: {
    padding: Spacing.two,
    gap: Spacing.one,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
});
