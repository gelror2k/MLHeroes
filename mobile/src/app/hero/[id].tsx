import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getErrorMessage, isAdminEnabled } from '@/api/client';
import { Chip } from '@/components/chip';
import { FavoriteButton } from '@/components/favorite-button';
import { HeroPortrait } from '@/components/hero-portrait';
import { ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Spacing } from '@/constants/theme';
import { useHero } from '@/hooks/use-hero';
import { useTheme } from '@/hooks/use-theme';
import { deleteHero } from '@/services/heroService';
import type { Hero, Skill } from '@/types/hero';

const SLOT_LABELS: Record<Skill['slot'], string> = {
  passive: 'Passive',
  skill1: 'Skill 1',
  skill2: 'Skill 2',
  ultimate: 'Ultimate',
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <View style={styles.rowValue}>{children}</View>
    </View>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const theme = useTheme();
  const stats = [skill.cooldown ? `CD ${skill.cooldown}` : null, skill.mana_cost ? `Mana ${skill.mana_cost}` : null]
    .filter(Boolean)
    .join('  ·  ');
  return (
    <View style={[styles.skill, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="small" themeColor="textSecondary">
        {SLOT_LABELS[skill.slot] ?? skill.slot}
      </ThemedText>
      <ThemedText type="smallBold">{skill.name}</ThemedText>
      {skill.description ? <ThemedText type="small">{skill.description}</ThemedText> : null}
      {stats ? (
        <ThemedText type="small" themeColor="textSecondary">
          {stats}
        </ThemedText>
      ) : null}
    </View>
  );
}

/** Header: edit pencil (admin only) next to the favorite heart. */
function HeaderActions({ hero }: { hero: Hero }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={styles.headerActions}>
      {isAdminEnabled() && (
        <Pressable
          onPress={() => router.push({ pathname: '/hero/form', params: { id: String(hero.hero_id) } })}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${hero.name}`}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
          <Ionicons name="create-outline" size={22} color={theme.tint} />
        </Pressable>
      )}
      <FavoriteButton hero={hero} />
    </View>
  );
}

/** Hero detail: large portrait, tags, and skills when the optional hero_skills table has rows. */
export default function HeroDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const heroId = Number(id);
  const { hero, loading, error, reload } = useHero(heroId);
  const theme = useTheme();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  function confirmDelete() {
    if (!hero) return;
    Alert.alert('Delete hero', `Remove ${hero.name} from the database? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteHero(hero.hero_id);
            router.back();
          } catch (e) {
            setDeleting(false);
            Alert.alert('Could not delete', getErrorMessage(e));
          }
        },
      },
    ]);
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen
        options={{
          title: hero?.name ?? 'Hero',
          headerRight: hero ? () => <HeaderActions hero={hero} /> : undefined,
        }}
      />

      {loading ? (
        <LoadingState message="Loading hero…" />
      ) : error || !hero ? (
        <ErrorState message={error ?? 'Hero not found.'} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.portraitWrap, { borderColor: theme.border }]}>
            <HeroPortrait hero={hero} initialSize={96} />
          </View>

          <View style={styles.titleBlock}>
            <ThemedText type="subtitle">{hero.name}</ThemedText>
            <Chip label={hero.difficulty} color={difficultyColor(hero.difficulty)} selected />
          </View>

          <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Row label="Role">
              {hero.roles.map((role) => (
                <Chip key={role} label={role} color={roleColor(role)} selected small />
              ))}
            </Row>
            <Row label="Lane">
              {hero.lanes.map((lane) => (
                <Chip key={lane} label={lane} small />
              ))}
            </Row>
          </View>

          <View style={styles.skillsBlock}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Skills
            </ThemedText>
            {hero.skills && hero.skills.length > 0 ? (
              hero.skills.map((skill) => <SkillCard key={skill.skill_id} skill={skill} />)
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                No skill details for this hero yet.
              </ThemedText>
            )}
          </View>

          {isAdminEnabled() && (
            <Pressable
              onPress={confirmDelete}
              disabled={deleting}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.deleteButton,
                { borderColor: theme.danger },
                (pressed || deleting) && styles.pressed,
              ]}>
              {deleting ? (
                <ActivityIndicator color={theme.danger} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                  <ThemedText type="smallBold" style={{ color: theme.danger }}>
                    Delete hero
                  </ThemedText>
                </>
              )}
            </Pressable>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  portraitWrap: {
    borderRadius: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  row: {
    gap: Spacing.one,
  },
  rowLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  rowValue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  skillsBlock: {
    gap: Spacing.two,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  skill: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerButton: {
    padding: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
});
