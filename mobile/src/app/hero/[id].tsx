import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage, isAdminEnabled } from '@/api/client';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DifficultyMeter } from '@/components/difficulty-meter';
import { FavoriteButton } from '@/components/favorite-button';
import { HeroHologram } from '@/components/hero-hologram';
import { IconButton } from '@/components/icon-button';
import { HeroMetaCard } from '@/components/live-meta';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SectionCard } from '@/components/section-card';
import { ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { useToast } from '@/components/toast';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Gutter, Radius, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useHero } from '@/hooks/use-hero';
import { useTheme } from '@/hooks/use-theme';
import { deleteHero } from '@/services/heroService';
import type { Skill } from '@/types/hero';

const SLOT_BADGE: Record<Skill['slot'], string> = { passive: 'P', skill1: '1', skill2: '2', ultimate: 'ULT' };
const SLOT_NAME: Record<Skill['slot'], string> = { passive: 'Passive', skill1: 'Skill 1', skill2: 'Skill 2', ultimate: 'Ultimate' };

/** Skill icon from `icon_url`; the slot badge (P / 1 / 2 / ULT) stands in when there is no link or it fails to load. */
function SkillIcon({ skill }: { skill: Skill }) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const ultimate = skill.slot === 'ultimate';
  const box = [
    styles.slot,
    ultimate
      ? { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }
      : { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
  ];

  if (skill.icon_url && !failed) {
    return (
      <View style={box}>
        <Image
          source={{ uri: skill.icon_url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          cachePolicy="disk"
          onError={() => setFailed(true)}
          accessibilityLabel={`${skill.name} icon`}
        />
      </View>
    );
  }
  return (
    <View style={box}>
      <ThemedText type="numeral" style={{ color: ultimate ? theme.accent : theme.textMuted, fontSize: 12 }}>
        {SLOT_BADGE[skill.slot] ?? '?'}
      </ThemedText>
    </View>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  const theme = useTheme();
  const ultimate = skill.slot === 'ultimate';
  const stats = [skill.cooldown ? `Cooldown ${skill.cooldown}` : null, skill.mana_cost ? `Mana ${skill.mana_cost}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.skillRow} accessibilityLabel={`${SLOT_NAME[skill.slot]}: ${skill.name}`}>
      <SkillIcon skill={skill} />
      <View style={styles.skillText}>
        <ThemedText type="micro" style={{ color: ultimate ? theme.accent : theme.textMuted }}>
          {SLOT_NAME[skill.slot] ?? skill.slot}
        </ThemedText>
        <ThemedText type="smallStrong" style={styles.skillName}>
          {skill.name}
        </ThemedText>
        {skill.description ? (
          <ThemedText type="caption" themeColor="textMuted">
            {skill.description}
          </ThemedText>
        ) : null}
        {stats ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {stats}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

/** Hero detail: draggable hologram stage, name + tags, overview card (lane + difficulty meter), skills with icons, sticky action bar. */
export default function HeroDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const heroId = Number(id);
  const { hero, loading, error, reload } = useHero(heroId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const admin = isAdminEnabled();
  const saved = hero ? isFavorite(hero.hero_id) : false;

  async function share() {
    if (!hero) return;
    try {
      await Share.share({
        message: `${hero.name} — ${hero.roles.join('/')} · ${hero.lanes.join('/')} · ${hero.difficulty}`,
      });
    } catch {
      // The user dismissed the share sheet; nothing to report.
    }
  }

  async function confirmDelete() {
    if (!hero) return;
    setDeleting(true);
    try {
      await deleteHero(hero.hero_id);
      toast.show(`${hero.name} removed from the database.`);
      setConfirming(false);
      router.back();
    } catch (e) {
      toast.show(getErrorMessage(e), 'danger');
      setDeleting(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader
        back="chevron"
        backLabel="Back to hero list"
        right={
          hero ? (
            <>
              <FavoriteButton hero={hero} />
              <IconButton icon="share-2" label={`Share ${hero.name}`} onPress={share} />
            </>
          ) : undefined
        }
      />

      {loading ? (
        <LoadingState message="Loading hero…" />
      ) : error || !hero ? (
        <ErrorState message={error ?? 'Hero not found.'} onRetry={reload} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.identity}>
              <View style={styles.stage}>
                <HeroHologram hero={hero} width={width} />
              </View>
              <View style={styles.identityText}>
                <ThemedText type="display" accessibilityRole="header">
                  {hero.name}
                </ThemedText>
                <View style={styles.tags}>
                  {hero.roles.map((role) => (
                    <Chip key={role} variant="tag" label={role} color={roleColor(role)} />
                  ))}
                  <Chip variant="tag" label={hero.difficulty} color={difficultyColor(hero.difficulty)} />
                </View>
              </View>
            </View>

            <SectionCard title="Overview" gap={Spacing.lg}>
              <View style={styles.overviewRow}>
                <ThemedText type="micro" themeColor="textMuted" style={styles.overviewLabel}>
                  Lane
                </ThemedText>
                <View style={styles.tags}>
                  {hero.lanes.map((lane) => (
                    <Chip key={lane} variant="tag" label={lane} />
                  ))}
                </View>
              </View>
              <View style={styles.overviewRow}>
                <ThemedText type="micro" themeColor="textMuted" style={styles.overviewLabel}>
                  Role
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.overviewValue}>
                  {hero.roles.join(' / ')}
                </ThemedText>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <DifficultyMeter difficulty={hero.difficulty} />
            </SectionCard>

            <HeroMetaCard name={hero.name} />

            <SectionCard
              title="Skills"
              aside={
                hero.skills && hero.skills.length > 0 ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {hero.skills.length} listed
                  </ThemedText>
                ) : undefined
              }>
              {hero.skills && hero.skills.length > 0 ? (
                hero.skills.map((skill) => <SkillRow key={skill.skill_id} skill={skill} />)
              ) : (
                <ThemedText type="caption" themeColor="textMuted">
                  No skill details for this hero yet.
                </ThemedText>
              )}
            </SectionCard>
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              { backgroundColor: theme.backgroundBar, borderTopColor: theme.border, paddingBottom: Spacing.md + insets.bottom },
            ]}>
            <Button
              label={saved ? 'Saved' : 'Save to favorites'}
              icon="bookmark"
              variant={saved ? 'secondary' : 'primary'}
              onPress={() => toggleFavorite(hero)}
              style={styles.primaryAction}
            />
            {admin ? (
              <>
                <IconButton
                  icon="edit-2"
                  label={`Edit ${hero.name}`}
                  size={50}
                  iconSize={21}
                  onPress={() => router.push({ pathname: '/hero/form', params: { id: String(hero.hero_id) } })}
                />
                <IconButton icon="trash-2" label={`Delete ${hero.name}`} tone="danger" size={50} iconSize={21} onPress={() => setConfirming(true)} />
              </>
            ) : null}
          </View>

          <ConfirmDialog
            visible={confirming}
            title={`Delete ${hero.name}?`}
            message="This removes the hero record and its linked skill rows from the database. The action cannot be undone."
            hero={hero}
            busy={deleting}
            onCancel={() => (deleting ? undefined : setConfirming(false))}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  identity: {
    gap: Spacing.md,
  },
  stage: {
    // Full-bleed: cancel the content gutter and top padding.
    marginHorizontal: -Gutter,
    marginTop: -Spacing.sm,
  },
  identityText: {
    gap: 9,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  overviewLabel: {
    width: 72,
  },
  overviewValue: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  slot: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  skillText: {
    flex: 1,
    gap: 3,
  },
  skillName: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    paddingHorizontal: Gutter,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  primaryAction: {
    flex: 1,
  },
});
