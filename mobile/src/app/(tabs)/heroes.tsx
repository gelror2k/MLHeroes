import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, type TextInput } from 'react-native';

import { FilterBar, NO_FILTERS, type FilterSelection } from '@/components/filter-bar';
import { HeroCard } from '@/components/hero-card';
import { HeroGridSkeleton } from '@/components/hero-card-skeleton';
import { IconButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SearchInput } from '@/components/search-input';
import { EmptyState, ErrorState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { Gutter, Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useFilters } from '@/hooks/use-filters';
import { useHeroes } from '@/hooks/use-heroes';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

type Params = {
  role?: string; // preselect a role (from the Home legend)
  focus?: string; // focus the search field (from the Home search box)
  t?: string; // changes on every hand-off so the same role can be re-applied
};

/** Hero roster: search + role chips (lane/difficulty behind the sliders button), two-column grid, infinite scroll. */
export default function HeroesScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<Params>();
  const [searchText, setSearchText] = useState('');
  const [selection, setSelection] = useState<FilterSelection>(NO_FILTERS);
  const [expanded, setExpanded] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const search = useDebouncedValue(searchText.trim());

  const { filters } = useFilters();
  const list = useHeroes({ search, ...selection });

  // Hand-offs from Home: a role tapped in the legend (applied once per `t`), or the search box.
  const [appliedT, setAppliedT] = useState<string | undefined>(undefined);
  if (params.t !== appliedT) {
    setAppliedT(params.t);
    if (params.role) setSelection({ ...NO_FILTERS, role: params.role });
  }

  useEffect(() => {
    if (!params.focus) return;
    const id = setTimeout(() => searchRef.current?.focus(), 250);
    return () => clearTimeout(id);
  }, [params.focus, params.t]);

  const renderItem = useCallback(({ item }: { item: Hero }) => <HeroCard hero={item} />, []);
  const keyExtractor = useCallback((item: Hero) => String(item.hero_id), []);

  const secondaryActive = selection.lane !== '' || selection.difficulty !== '';
  const hasQuery = search !== '' || selection.role !== '' || secondaryActive;
  const showSkeleton = list.loading && list.heroes.length === 0;
  const showError = Boolean(list.error) && list.heroes.length === 0;

  function clearAll() {
    setSearchText('');
    setSelection(NO_FILTERS);
  }

  return (
    <Screen>
      <ScreenHeader
        title="Heroes"
        right={
          <IconButton
            icon="sliders"
            label={expanded ? 'Hide lane and difficulty filters' : 'Show lane and difficulty filters'}
            tone={secondaryActive ? 'accent' : 'default'}
            active={expanded && !secondaryActive}
            onPress={() => setExpanded((v) => !v)}
          />
        }
      />

      <FlatList
        data={showSkeleton || showError ? [] : list.heroes}
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
        ListHeaderComponent={
          <View style={styles.controls}>
            <View style={styles.gutter}>
              <SearchInput ref={searchRef} value={searchText} onChangeText={setSearchText} />
            </View>
            <FilterBar filters={filters} selection={selection} onChange={setSelection} expanded={expanded || secondaryActive} />
            <View style={[styles.statusRow, styles.gutter]}>
              <ThemedText type="caption" themeColor="textMuted">
                {list.loading
                  ? list.heroes.length > 0
                    ? 'Searching…'
                    : 'Loading…'
                  : `${list.heroes.length} of ${list.total} hero${list.total === 1 ? '' : 'es'}`}
              </ThemedText>
              {list.stale ? (
                <View style={styles.stale}>
                  <Feather name="wifi-off" size={13} color={theme.warning} />
                  <ThemedText type="caption" style={{ color: theme.warning }}>
                    Offline · saved list
                  </ThemedText>
                </View>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  A–Z
                </ThemedText>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          showSkeleton ? (
            <View style={styles.gutter}>
              <HeroGridSkeleton />
            </View>
          ) : showError ? (
            <ErrorState message={list.error ?? ''} onRetry={list.retry} />
          ) : (
            <EmptyState
              title="No heroes found"
              message={hasQuery ? 'Try a different name or clear the filters.' : 'The roster is empty.'}
              action={hasQuery ? { label: 'Clear filters', onPress: clearAll } : undefined}
            />
          )
        }
        ListFooterComponent={
          list.loadingMore ? <ActivityIndicator style={styles.footer} color={theme.accent} /> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  gutter: {
    paddingHorizontal: Gutter,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
  footer: {
    paddingVertical: Spacing.lg,
  },
});
