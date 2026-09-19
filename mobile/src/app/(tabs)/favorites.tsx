import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { HeroCard } from '@/components/hero-card';
import { EmptyState, LoadingState } from '@/components/state-views';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import type { Hero } from '@/types/hero';

/** Heroes saved on this device. No network needed; the list comes straight from AsyncStorage. */
export default function FavoritesScreen() {
  const { favorites, hydrated } = useFavorites();

  const renderItem = useCallback(({ item }: { item: Hero }) => <HeroCard hero={item} />, []);
  const keyExtractor = useCallback((item: Hero) => String(item.hero_id), []);

  if (!hydrated) {
    return (
      <ThemedView style={styles.screen}>
        <LoadingState message="Loading favorites…" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            message="Tap the heart on any hero to save it here. Favorites stay on this device."
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    flexGrow: 1,
  },
  column: {
    gap: Spacing.three,
  },
});
