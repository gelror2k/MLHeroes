import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { FilterBar, type FilterSelection } from '@/components/filter-bar';
import { HeroCard } from '@/components/hero-card';
import { SearchInput } from '@/components/search-input';
import { EmptyState, ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useFilters } from '@/hooks/use-filters';
import { useHeroes } from '@/hooks/use-heroes';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

const NO_FILTERS: FilterSelection = { role: '', lane: '', difficulty: '' };

/** Hero list: search + filter chips on top, two-column grid below with infinite scroll. */
export default function HeroesScreen() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selection, setSelection] = useState<FilterSelection>(NO_FILTERS);
  const search = useDebouncedValue(searchText.trim());

  const { filters } = useFilters();
  const list = useHeroes({ search, ...selection });

  const renderItem = useCallback(({ item }: { item: Hero }) => <HeroCard hero={item} />, []);
  const keyExtractor = useCallback((item: Hero) => String(item.hero_id), []);

  const hasQuery = search !== '' || selection.role !== '' || selection.lane !== '' || selection.difficulty !== '';

  let body: ReactNode;
  if (list.loading && list.heroes.length === 0) {
    body = <LoadingState message="Loading heroes…" />;
  } else if (list.error && list.heroes.length === 0) {
    body = <ErrorState message={list.error} onRetry={list.retry} />;
  } else {
    body = (
      <FlatList
        data={list.heroes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        refreshing={list.refreshing}
        onRefresh={list.refresh}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <EmptyState
            title="No heroes found"
            message={hasQuery ? 'Try a different search or clear a filter.' : 'The hero list is empty.'}
          />
        }
        ListFooterComponent={
          list.loadingMore ? <ActivityIndicator style={styles.footer} color={theme.tint} /> : null
        }
      />
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.controls}>
        <View style={styles.searchWrap}>
          <SearchInput value={searchText} onChangeText={setSearchText} />
        </View>
        <FilterBar filters={filters} selection={selection} onChange={setSelection} />
        <View style={styles.statusRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {list.loading ? ' ' : `${list.total} hero${list.total === 1 ? '' : 'es'}`}
          </ThemedText>
          {list.stale && (
            <View style={styles.stale}>
              <Ionicons name="cloud-offline-outline" size={14} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                Offline. Showing saved list. Pull to refresh.
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      {body}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  controls: {
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  searchWrap: {
    paddingHorizontal: Spacing.three,
  },
  statusRow: {
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    flexShrink: 1,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    flexGrow: 1,
  },
  column: {
    gap: Spacing.three,
  },
  footer: {
    paddingVertical: Spacing.three,
  },
});
