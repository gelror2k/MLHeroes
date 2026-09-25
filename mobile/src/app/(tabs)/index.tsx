import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { BarRow } from '@/components/bar-row';
import { BrandMark } from '@/components/brand-mark';
import { Chip } from '@/components/chip';
import { HeroPortrait } from '@/components/hero-portrait';
import { IconButton } from '@/components/icon-button';
import { LiveMetaCard } from '@/components/live-meta';
import { RoleRing } from '@/components/role-ring';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SectionCard } from '@/components/section-card';
import { StatTile } from '@/components/stat-tile';
import { ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Gutter, Radius, Sizes, Spacing } from '@/constants/theme';
import { useDashboard } from '@/hooks/use-dashboard';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import type { Hero } from '@/types/hero';

const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard'];
const SAVED_PREVIEW = 5;

/** Small status badge: coloured text on a soft tint of the same colour. Only used for the offline notice now. */
function StatusPill({ label, color, soft, border }: { label: string; color: string; soft: string; border: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: soft, borderColor: border }]}>
      <ThemedText type="eyebrow" style={{ color, letterSpacing: 0.9 }}>
        {label}
      </ThemedText>
    </View>
  );
}

/** Today's hero: portrait, role, difficulty, and a jump to the detail screen. */
function Spotlight({ hero }: { hero: Hero }) {
  const router = useRouter();
  const open = () => router.push({ pathname: '/hero/[id]', params: { id: String(hero.hero_id) } });
  const primaryRole = hero.roles[0] ?? '';

  return (
    <SectionCard
      title="Hero spotlight"
      aside={
        <ThemedText type="eyebrow" themeColor="accent" style={{ letterSpacing: 0.9 }}>
          Today
        </ThemedText>
      }>
      <Pressable onPress={open} accessibilityRole="button" accessibilityLabel={`Open ${hero.name}`} style={styles.spotlightRow}>
        <HeroPortrait hero={hero} size={64} />
        <View style={styles.spotlightText}>
          <ThemedText type="heading" numberOfLines={1}>
            {hero.name}
          </ThemedText>
          <View style={styles.spotlightMeta}>
            <Chip variant="tag" label={primaryRole} color={roleColor(primaryRole)} />
            <ThemedText type="caption" themeColor="textMuted">
              Difficulty{' '}
              <ThemedText type="caption" style={{ color: difficultyColor(hero.difficulty) }}>
                {hero.difficulty}
              </ThemedText>
            </ThemedText>
          </View>
        </View>
        <IconButton icon="chevron-right" label={`Open ${hero.name} detail`} onPress={open} iconSize={18} />
      </Pressable>
      <View style={styles.tileRow}>
        <StatTile raised centered value={hero.roles.join(' / ')} label="Role" />
        <StatTile raised centered value={hero.lanes.join(' / ')} label="Lane" />
        <StatTile raised centered value={hero.difficulty} label="Difficulty" tone="accent" />
      </View>
    </SectionCard>
  );
}

/** Hero list + role/lane/difficulty counts + saved heroes, computed from the whole roster. */
export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { favorites } = useFavorites();
  const dash = useDashboard();

  const hasData = dash.heroes.length > 0;
  const multiRole = dash.heroes.some((h) => h.roles.length > 1);
  const savedPreview = favorites.slice(-SAVED_PREVIEW).reverse();

  return (
    <Screen>
      <ScreenHeader>
        <BrandMark />
      </ScreenHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={dash.refreshing}
            onRefresh={dash.refresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
            progressBackgroundColor={theme.surface}
          />
        }>
        {dash.stale ? (
          <View style={styles.pills}>
            <StatusPill label="Offline · cached" color={theme.warning} soft="rgba(255,159,90,0.14)" border="rgba(255,159,90,0.34)" />
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push({ pathname: '/heroes', params: { focus: '1', t: String(Date.now()) } })}
          accessibilityRole="search"
          accessibilityLabel="Search heroes"
          style={({ pressed }) => [
            styles.searchField,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && styles.pressed,
          ]}>
          <Feather name="search" size={18} color={theme.textMuted} />
          <ThemedText type="body" themeColor="textMuted">
            Search hero name
          </ThemedText>
        </Pressable>

        <View style={styles.tileRow}>
          <StatTile value={hasData ? dash.total : '—'} label="Heroes" />
          <StatTile value={hasData ? dash.roles.length : '—'} label="Roles" />
          <StatTile value={favorites.length} label="Saved" tone="accent" />
        </View>

        {/* Third-party API: loads on its own, so it shows even when our API is down. */}
        <LiveMetaCard roster={dash.heroes} />

        {dash.loading && !hasData ? (
          <View style={styles.stateWrap}>
            <LoadingState message="Counting the roster…" />
          </View>
        ) : dash.error && !hasData ? (
          <View style={styles.stateWrap}>
            <ErrorState message={dash.error} onRetry={dash.retry} />
          </View>
        ) : (
          <>
            {dash.spotlight ? <Spotlight hero={dash.spotlight} /> : null}

            <SectionCard
              title="Role distribution"
              aside={
                <ThemedText type="small" themeColor="textSecondary">
                  {dash.total} total
                </ThemedText>
              }>
              <View style={styles.ringWrap}>
                <RoleRing
                  segments={dash.roles.map((r) => ({ label: r.label, value: r.count, color: roleColor(r.label) }))}
                  centerValue={dash.total}
                />
              </View>
              <View style={styles.legend}>
                {dash.roles.map((r) => (
                  <Pressable
                    key={r.label}
                    onPress={() => router.push({ pathname: '/heroes', params: { role: r.label, t: String(Date.now()) } })}
                    accessibilityRole="button"
                    accessibilityLabel={`${r.label}, ${r.count} heroes. Show them`}
                    style={({ pressed }) => [styles.legendItem, pressed && styles.pressed]}>
                    <View style={[styles.swatch, { backgroundColor: roleColor(r.label) }]} />
                    <ThemedText type="small" themeColor="textSecondary" style={styles.legendLabel} numberOfLines={1}>
                      {r.label}
                    </ThemedText>
                    <ThemedText type="smallStrong">{r.count}</ThemedText>
                  </Pressable>
                ))}
              </View>
              {multiRole ? (
                <ThemedText type="caption" themeColor="textMuted">
                  Multi-role heroes count toward each of their roles. Tap a role to browse it.
                </ThemedText>
              ) : (
                <ThemedText type="caption" themeColor="textMuted">
                  Tap a role to browse it.
                </ThemedText>
              )}
            </SectionCard>

            <SectionCard
              title="Difficulty spread"
              aside={
                <ThemedText type="small" themeColor="textSecondary">
                  of {dash.total} heroes
                </ThemedText>
              }>
              {DIFFICULTY_ORDER.map((level) => {
                const count = dash.difficulties.find((d) => d.label === level)?.count ?? 0;
                return (
                  <BarRow
                    key={level}
                    label={level}
                    ratio={dash.total > 0 ? count / dash.total : 0}
                    value={count}
                    color={difficultyColor(level)}
                  />
                );
              })}
            </SectionCard>

            <SectionCard
              title="Saved heroes"
              aside={
                favorites.length > 0 ? (
                  <Pressable onPress={() => router.push('/favorites')} hitSlop={8} accessibilityRole="link">
                    <ThemedText type="small" themeColor="textMuted" style={styles.link}>
                      See all
                    </ThemedText>
                  </Pressable>
                ) : null
              }>
              {savedPreview.length === 0 ? (
                <ThemedText type="caption" themeColor="textMuted">
                  Tap the bookmark on any hero to keep it here. Saved heroes stay on this device.
                </ThemedText>
              ) : (
                <View style={styles.savedRow}>
                  {savedPreview.map((hero) => (
                    <Pressable
                      key={hero.hero_id}
                      onPress={() => router.push({ pathname: '/hero/[id]', params: { id: String(hero.hero_id) } })}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${hero.name}`}
                      style={({ pressed }) => [styles.savedItem, pressed && styles.pressed]}>
                      <HeroPortrait hero={hero} size={52} />
                      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={styles.savedName}>
                        {hero.name}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              )}
            </SectionCard>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: 18,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  searchField: {
    height: Sizes.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  tileRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  stateWrap: {
    minHeight: 280,
  },
  spotlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  spotlightText: {
    flex: 1,
    gap: 7,
  },
  spotlightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ringWrap: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 11,
  },
  legendItem: {
    flexBasis: '45%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 28,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    flex: 1,
  },
  link: {
    textDecorationLine: 'underline',
  },
  savedRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  savedItem: {
    width: 52,
    alignItems: 'center',
    gap: 7,
  },
  savedName: {
    width: 60,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
