import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { BarRow } from '@/components/bar-row';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { IconButton } from '@/components/icon-button';
import { SectionCard } from '@/components/section-card';
import { StatTile } from '@/components/stat-tile';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useHeroMeta, useTopHeroes } from '@/hooks/use-meta';
import { useTheme } from '@/hooks/use-theme';
import { heroKey, META_DAYS } from '@/services/metaService';
import type { Hero } from '@/types/hero';
import type { HeroMeta, MetaSort } from '@/types/meta';

/**
 * Cards fed by the third-party Rone Arena API (live MLBB ranked data).
 * They load on their own, so a slow or failing external API never blocks the
 * rest of the screen, which comes from our PHP API.
 */

const SORTS: { value: MetaSort; label: string; pick: (h: HeroMeta) => number }[] = [
  { value: 'win_rate', label: 'Win', pick: (h) => h.winRate },
  { value: 'pick_rate', label: 'Pick', pick: (h) => h.pickRate },
  { value: 'ban_rate', label: 'Ban', pick: (h) => h.banRate },
];

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function SourceNote() {
  return (
    <ThemedText type="caption" themeColor="textMuted">
      Live ranked data · last {META_DAYS} days · all ranks · via Rone Arena API
    </ThemedText>
  );
}

function InlineLoading({ message }: { message: string }) {
  const theme = useTheme();
  return (
    <View style={styles.inlineState} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator color={theme.accent} />
      <ThemedText type="small" themeColor="textMuted">
        {message}
      </ThemedText>
    </View>
  );
}

function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.errorState}>
      <ThemedText type="small" themeColor="danger">
        Live stats unavailable. {message}
      </ThemedText>
      <Button label="Try again" icon="refresh-cw" variant="secondary" compact onPress={onRetry} />
    </View>
  );
}

function HeroHead({ uri, size }: { uri: string; size: number }) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: Radius.sm, backgroundColor: theme.surfaceRaised };
  if (!uri || failed) return <View style={box} />;
  return <Image source={{ uri }} style={box} contentFit="cover" cachePolicy="disk" onError={() => setFailed(true)} />;
}

/**
 * Home: top 5 heroes by win / pick / ban rate. A row opens our own profile for
 * that hero when the name matches one in the roster.
 */
export function LiveMetaCard({ roster }: { roster: Hero[] }) {
  const router = useRouter();
  const [sort, setSort] = useState<MetaSort>('win_rate');
  const top = useTopHeroes(sort);
  const current = SORTS.find((s) => s.value === sort) ?? SORTS[0];

  const byKey = new Map(roster.map((h) => [heroKey(h.name), h]));
  const best = top.heroes.length > 0 ? Math.max(...top.heroes.map(current.pick)) : 0;

  return (
    <SectionCard
      title="Live ranked meta"
      aside={<IconButton icon="refresh-cw" label="Reload live stats" onPress={top.retry} iconSize={16} />}>
      <View style={styles.sortRow}>
        {SORTS.map((s) => (
          <Chip key={s.value} label={`${s.label} rate`} selected={s.value === sort} onPress={() => setSort(s.value)} />
        ))}
      </View>

      {top.loading ? (
        <InlineLoading message="Fetching live stats…" />
      ) : top.error ? (
        <InlineError message={top.error} onRetry={top.retry} />
      ) : top.heroes.length === 0 ? (
        <ThemedText type="caption" themeColor="textMuted">
          The stats service returned no heroes right now.
        </ThemedText>
      ) : (
        top.heroes.map((h, i) => {
          const ours = byKey.get(heroKey(h.name));
          const open = ours
            ? () => router.push({ pathname: '/hero/[id]', params: { id: String(ours.hero_id) } })
            : undefined;
          return (
            <Pressable
              key={h.gameHeroId || h.name}
              onPress={open}
              disabled={!open}
              accessibilityRole={open ? 'button' : undefined}
              accessibilityLabel={`${i + 1}. ${h.name}, ${current.label.toLowerCase()} rate ${pct(current.pick(h))}`}
              style={({ pressed }) => [styles.rankRow, pressed && styles.pressed]}>
              <ThemedText type="numeral" themeColor="textMuted" style={styles.rankNo}>
                {i + 1}
              </ThemedText>
              <HeroHead uri={h.head} size={36} />
              <View style={styles.rankBody}>
                <ThemedText type="smallStrong" numberOfLines={1}>
                  {h.name}
                </ThemedText>
                <BarRow
                  label=""
                  ratio={best > 0 ? current.pick(h) / best : 0}
                  value={pct(current.pick(h))}
                />
              </View>
            </Pressable>
          );
        })
      )}

      <SourceNote />
    </SectionCard>
  );
}

/** Hero profile: this hero's live win / pick / ban rate. */
export function HeroMetaCard({ name }: { name: string }) {
  const meta = useHeroMeta(name);

  return (
    <SectionCard
      title="Live ranked stats"
      aside={<IconButton icon="refresh-cw" label="Reload live stats" onPress={meta.retry} iconSize={16} />}>
      {meta.loading ? (
        <InlineLoading message="Fetching live stats…" />
      ) : meta.error ? (
        <InlineError message={meta.error} onRetry={meta.retry} />
      ) : !meta.hero ? (
        <ThemedText type="caption" themeColor="textMuted">
          No live ranked data for {name}. The stats service only lists heroes from the official game.
        </ThemedText>
      ) : (
        <View style={styles.tileRow}>
          <StatTile raised centered value={pct(meta.hero.winRate)} label="Win rate" tone="success" />
          <StatTile raised centered value={pct(meta.hero.pickRate)} label="Pick rate" />
          <StatTile raised centered value={pct(meta.hero.banRate)} label="Ban rate" tone="danger" />
        </View>
      )}
      <SourceNote />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  inlineState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    minHeight: 60,
  },
  errorState: {
    gap: Spacing.sm + 2,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    minHeight: 44,
  },
  rankNo: {
    width: 14,
    textAlign: 'center',
  },
  rankBody: {
    flex: 1,
    gap: 4,
  },
  tileRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
