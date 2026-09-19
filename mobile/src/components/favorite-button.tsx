import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { Radius } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type FavoriteButtonProps = {
  hero: Hero;
  /** square = 44px bordered button (headers). bare = compact tile for inside cards. */
  variant?: 'square' | 'bare';
  style?: StyleProp<ViewStyle>;
};

/** Bookmark toggle. Reads and writes the shared favorites context; gold when saved. */
export function FavoriteButton({ hero, variant = 'square', style }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();
  const active = isFavorite(hero.hero_id);
  const label = active ? `Remove ${hero.name} from saved` : `Save ${hero.name}`;

  function onPress() {
    Haptics.selectionAsync().catch(() => {});
    toggleFavorite(hero);
  }

  if (variant === 'square') {
    return <IconButton icon="bookmark" label={label} onPress={onPress} active={active} style={style} />;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.bare,
        active && { backgroundColor: theme.accentSoft },
        pressed && styles.pressed,
        style,
      ]}>
      <Feather name="bookmark" size={17} color={active ? theme.accent : theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bare: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
