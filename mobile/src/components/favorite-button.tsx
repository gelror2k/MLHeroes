import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type FavoriteButtonProps = {
  hero: Hero;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Heart toggle. Reads and writes the shared favorites context. */
export function FavoriteButton({ hero, size = 22, style }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();
  const active = isFavorite(hero.hero_id);

  return (
    <Pressable
      onPress={() => toggleFavorite(hero)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? `Remove ${hero.name} from favorites` : `Add ${hero.name} to favorites`}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? theme.danger : theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.6,
  },
});
