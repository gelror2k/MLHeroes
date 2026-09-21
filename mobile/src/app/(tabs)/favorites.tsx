import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { HeroCard } from '@/components/hero-card';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { EmptyState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { Gutter, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import type { Hero } from '@/types/hero';

/** Heroes saved on this device. No network needed; the list comes straight from AsyncStorage. */
export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, hydrated } = useFavorites();

  const renderItem = useCallback(({ item }: { item: Hero }) => <HeroCard hero={item} />, []);
  const keyExtractor = useCallback((item: Hero) => String(item.hero_id), []);

  const count = favorites.length;
  // toggleFavorite appends, so storage order is oldest-first. The header promises
  // newest first (and Home's preview shows newest first), so reverse for display.
  const ordered = useMemo(() => [...favorites].reverse(), [favorites]);

  return (
    <Screen>
      <ScreenHeader
        title="Saved"
        right={
          hydrated && count > 0 ? (
            <ThemedText type="small" themeColor="textMuted">
              {count} hero{count === 1 ? '' : 'es'}
            </ThemedText>
          ) : undefined
        }
      />
      {!hydrated ? (
        <LoadingState message="Loading saved heroes…" />
      ) : (
        <FlatList
          data={ordered}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            count > 0 ? (
              <View style={styles.intro}>
                <ThemedText type="caption" themeColor="textMuted">
                  Kept on this device only. Newest first.
                </ThemedText>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="bookmark"
              title="Nothing saved yet"
              message="Tap the bookmark on any hero to keep it here for quick access. Saved heroes stay on this device."
              action={{ label: 'Browse heroes', onPress: () => router.push('/heroes') }}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    paddingHorizontal: Gutter,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  column: {
    gap: Spacing.md,
    paddingHorizontal: Gutter,
    marginBottom: Spacing.md,
  },
});
