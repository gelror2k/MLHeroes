import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Spacing } from '@/constants/theme';
import type { Filters } from '@/types/hero';

export type FilterSelection = {
  role: string;
  lane: string;
  difficulty: string;
};

type FilterBarProps = {
  filters: Filters;
  selection: FilterSelection;
  onChange: (next: FilterSelection) => void;
};

type RowProps = {
  title: string;
  values: string[];
  selected: string;
  colorFor?: (value: string) => string;
  onSelect: (value: string) => void;
};

/** One horizontally scrolling row of chips. Tapping the selected chip clears it. */
function FilterRow({ title, values, selected, colorFor, onSelect }: RowProps) {
  if (values.length === 0) return null;
  return (
    <View style={styles.row}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.rowTitle}>
        {title}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
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
 * Role / lane / difficulty chip rows. Values come from filters.php and are never hardcoded.
 * Each row is single-select; "All" clears it.
 */
export function FilterBar({ filters, selection, onChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <FilterRow
        title="Role"
        values={filters.roles}
        selected={selection.role}
        colorFor={roleColor}
        onSelect={(role) => onChange({ ...selection, role })}
      />
      <FilterRow
        title="Lane"
        values={filters.lanes}
        selected={selection.lane}
        onSelect={(lane) => onChange({ ...selection, lane })}
      />
      <FilterRow
        title="Difficulty"
        values={filters.difficulties}
        selected={selection.difficulty}
        colorFor={difficultyColor}
        onSelect={(difficulty) => onChange({ ...selection, difficulty })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.one,
  },
  rowTitle: {
    paddingHorizontal: Spacing.three,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  chips: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
});
