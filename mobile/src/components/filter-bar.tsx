import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Gutter, Spacing } from '@/constants/theme';
import type { Filters } from '@/types/hero';

export type FilterSelection = {
  role: string;
  lane: string;
  difficulty: string;
};

export const NO_FILTERS: FilterSelection = { role: '', lane: '', difficulty: '' };

type FilterBarProps = {
  filters: Filters;
  selection: FilterSelection;
  onChange: (next: FilterSelection) => void;
  /** Show the lane and difficulty rows (the header's sliders button toggles this). */
  expanded: boolean;
};

type RowProps = {
  title: string;
  values: string[];
  selected: string;
  colorFor?: (value: string) => string;
  onSelect: (value: string) => void;
};

/** One horizontally scrolling row of chips. Tapping the selected chip clears it. */
function ScrollRow({ title, values, selected, colorFor, onSelect }: RowProps) {
  if (values.length === 0) return null;
  return (
    <View style={styles.row}>
      <ThemedText type="eyebrow" themeColor="textMuted" style={styles.rowTitle}>
        {title}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollChips}
        keyboardShouldPersistTaps="handled">
        <Chip label="All" selected={selected === ''} onPress={() => onSelect('')} />
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            color={colorFor?.(value)}
            selected={selected === value}
            onPress={() => onSelect(selected === value ? '' : value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * Role chips always visible (wrapped, like the design); lane and difficulty rows
 * appear when expanded. Values come from filters.php and are never hardcoded.
 */
export function FilterBar({ filters, selection, onChange, expanded }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapChips}>
        <Chip label="All" selected={selection.role === ''} onPress={() => onChange({ ...selection, role: '' })} />
        {filters.roles.map((role) => (
          <Chip
            key={role}
            label={role}
            color={roleColor(role)}
            selected={selection.role === role}
            onPress={() => onChange({ ...selection, role: selection.role === role ? '' : role })}
          />
        ))}
      </View>
      {expanded && (
        <>
          <ScrollRow
            title="Lane"
            values={filters.lanes}
            selected={selection.lane}
            onSelect={(lane) => onChange({ ...selection, lane })}
          />
          <ScrollRow
            title="Difficulty"
            values={filters.difficulties}
            selected={selection.difficulty}
            colorFor={difficultyColor}
            onSelect={(difficulty) => onChange({ ...selection, difficulty })}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  wrapChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Gutter,
  },
  row: {
    gap: Spacing.sm,
  },
  rowTitle: {
    paddingHorizontal: Gutter,
  },
  scrollChips: {
    paddingHorizontal: Gutter,
    gap: Spacing.sm,
  },
});
