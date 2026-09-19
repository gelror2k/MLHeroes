import { Stack, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import type { Skill } from '@/types/hero';

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

/** Hero detail: large portrait, tags, and skills when the optional hero_skills table has rows. */
export default function HeroDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const heroId = Number(id);
  const { hero, loading, error, reload } = useHero(heroId);
  const theme = useTheme();

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen
        options={{
          title: hero?.name ?? 'Hero',
          headerRight: hero ? () => <FavoriteButton hero={hero} /> : undefined,
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
});
