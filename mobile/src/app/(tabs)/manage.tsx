import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { getErrorMessage, isAdminEnabled } from '@/api/client';
import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { HeroPortrait } from '@/components/hero-portrait';
import { IconButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SearchInput } from '@/components/search-input';
import { StatTile } from '@/components/stat-tile';
import { EmptyState, ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { useToast } from '@/components/toast';
import { roleColor } from '@/constants/roleColors';
import { Gutter, Radius, Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useFilters } from '@/hooks/use-filters';
import { useHeroes } from '@/hooks/use-heroes';
import { useTheme } from '@/hooks/use-theme';
import { deleteHero } from '@/services/heroService';
import type { Hero } from '@/types/hero';

type RecordCardProps = {
  hero: Hero;
  onEdit: (hero: Hero) => void;
  onDelete: (hero: Hero) => void;
  onOpen: (hero: Hero) => void;
};

/** One database row: identity on top, Edit / Delete underneath. */
function RecordCardInner({ hero, onEdit, onDelete, onOpen }: RecordCardProps) {
  const theme = useTheme();
  const primaryRole = hero.roles[0] ?? '';
  return (
    <View style={[styles.record, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        onPress={() => onOpen(hero)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${hero.name}`}
        style={({ pressed }) => [styles.recordTop, pressed && styles.pressed]}>
        <HeroPortrait hero={hero} size={42} radius={Radius.sm} />
        <View style={styles.recordText}>
          <ThemedText type="cardTitle" numberOfLines={1}>
            {hero.name}
          </ThemedText>
          <ThemedText type="micro" style={{ color: roleColor(primaryRole), letterSpacing: 1 }} numberOfLines={1}>
            {hero.roles.join(' / ')}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="textMuted">
          #{hero.hero_id}
        </ThemedText>
      </Pressable>
      <View style={styles.recordActions}>
        <Button label="Edit" icon="edit-2" variant="secondary" compact onPress={() => onEdit(hero)} style={styles.recordAction} />
        <Button label="Delete" icon="trash-2" variant="danger" compact onPress={() => onDelete(hero)} style={styles.recordAction} />
      </View>
    </View>
  );
}

const RecordCard = memo(RecordCardInner);

/** Admin-only table view of the heroes table with create / edit / delete. */
export default function ManageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const { filters } = useFilters();
  const [searchText, setSearchText] = useState('');
  const search = useDebouncedValue(searchText.trim());
  const list = useHeroes({ search });

  const [target, setTarget] = useState<Hero | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openForm = useCallback((hero?: Hero) => {
    router.push(hero ? { pathname: '/hero/form', params: { id: String(hero.hero_id) } } : '/hero/form');
  }, [router]);
  const openDetail = useCallback(
    (hero: Hero) => router.push({ pathname: '/hero/[id]', params: { id: String(hero.hero_id) } }),
    [router],
  );
  const askDelete = useCallback((hero: Hero) => setTarget(hero), []);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await deleteHero(target.hero_id);
      toast.show(`${target.name} removed from the database.`);
      setTarget(null);
    } catch (e) {
      toast.show(getErrorMessage(e), 'danger');
    } finally {
      setDeleting(false);
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: Hero }) => <RecordCard hero={item} onEdit={openForm} onDelete={askDelete} onOpen={openDetail} />,
    [openForm, askDelete, openDetail],
  );
  const keyExtractor = useCallback((item: Hero) => String(item.hero_id), []);

  if (!isAdminEnabled()) {
    return (
      <Screen>
        <ScreenHeader title="Hero records" />
        <EmptyState
          icon="lock"
          title="Admin key not set"
          message="Add EXPO_PUBLIC_ADMIN_KEY to mobile/.env to create, edit and delete heroes from the app."
        />
      </Screen>
    );
  }

  const showLoading = list.loading && list.heroes.length === 0;
  const showError = Boolean(list.error) && list.heroes.length === 0;

  return (
    <Screen>
      <ScreenHeader
        title="Hero records"
        right={<IconButton icon="plus" label="Create a new hero record" tone="accent" onPress={() => openForm()} />}
      />

      <FlatList
        data={showLoading || showError ? [] : list.heroes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        refreshing={list.refreshing}
        onRefresh={list.refresh}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.controls}>
            <View style={styles.tileRow}>
              <StatTile value={showLoading ? '—' : list.total} label="Records" />
              <StatTile value={filters.roles.length || '—'} label="Roles" />
              <StatTile value={filters.lanes.length || '—'} label="Lanes" />
            </View>
            <SearchInput value={searchText} onChangeText={setSearchText} placeholder="Search records" />
            <View style={styles.statusRow}>
              <ThemedText type="caption" themeColor="textMuted">
                {showLoading ? 'Loading…' : `Showing ${list.heroes.length} of ${list.total}`}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                A–Z
              </ThemedText>
            </View>
          </View>
        }
        ListEmptyComponent={
          showLoading ? (
            <LoadingState message="Loading records…" />
          ) : showError ? (
            <ErrorState message={list.error ?? ''} onRetry={list.retry} />
          ) : (
            <EmptyState
              icon="database"
              title={search ? 'No matching records' : 'No records yet'}
              message={search ? 'Try a different name.' : 'Create the first hero record to get started.'}
              action={search ? undefined : { label: 'Add new hero', onPress: () => openForm() }}
            />
          )
        }
        ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={theme.accent} /> : null}
      />

      <View style={[styles.bottomBar, { backgroundColor: theme.backgroundBar, borderTopColor: theme.border }]}>
        <Button label="Add new hero" icon="plus" onPress={() => openForm()} />
      </View>

      <ConfirmDialog
        visible={target !== null}
        title={`Delete ${target?.name ?? 'hero'}?`}
        message="This removes the hero record and its linked skill rows from the database. The action cannot be undone."
        hero={target}
        busy={deleting}
        onCancel={() => (deleting ? undefined : setTarget(null))}
        onConfirm={confirmDelete}
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
  tileRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Gutter,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  record: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 11,
    marginBottom: Spacing.md,
  },
  recordTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  recordText: {
    flex: 1,
    gap: 3,
  },
  recordActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  recordAction: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    paddingVertical: Spacing.lg,
  },
  bottomBar: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
});
