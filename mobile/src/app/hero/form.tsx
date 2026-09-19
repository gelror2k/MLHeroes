import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { getErrorMessage } from '@/api/client';
import { Chip } from '@/components/chip';
import { HeroPortrait } from '@/components/hero-portrait';
import { ErrorState, LoadingState } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Spacing } from '@/constants/theme';
import { useFilters } from '@/hooks/use-filters';
import { useHero } from '@/hooks/use-hero';
import { useTheme } from '@/hooks/use-theme';
import { createHero, updateHero } from '@/services/heroService';
import type { HeroInput } from '@/types/hero';

// The API accepts exactly these; it's a data convention, not a filter list.
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const EMPTY: HeroInput = { name: '', role: '', lane: '', difficulty: '', picture: '' };

/** "Mage/Tank" -> ["Mage", "Tank"], mirroring the API's split rules. */
function splitList(value: string): string[] {
  return value
    .split(/[/,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toggleInList(value: string, item: string): string {
  const parts = splitList(value);
  const next = parts.includes(item) ? parts.filter((p) => p !== item) : [...parts, item];
  return next.join('/');
}

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      {children}
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

/**
 * Create a hero (no `id` param) or edit one (`?id=12`).
 * Role and lane are free text with quick-toggle chips from filters.php, so
 * existing values are one tap and new ones can still be typed.
 */
export default function HeroFormScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const heroId = id ? Number(id) : NaN;
  const isEdit = Number.isInteger(heroId) && heroId > 0;

  const { filters } = useFilters();
  const existing = useHero(isEdit ? heroId : NaN);

  const [form, setForm] = useState<HeroInput>(EMPTY);
  const [prefilled, setPrefilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fill the form once the hero we're editing has loaded.
  useEffect(() => {
    if (isEdit && existing.hero && !prefilled) {
      const { name, role, lane, difficulty, picture } = existing.hero;
      setForm({ name, role, lane, difficulty, picture });
      setPrefilled(true);
    }
  }, [isEdit, existing.hero, prefilled]);

  const set = (key: keyof HeroInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!form.name.trim()) list.push('Name is required.');
    if (splitList(form.role).length === 0) list.push('At least one role is required.');
    if (splitList(form.lane).length === 0) list.push('At least one lane is required.');
    if (!DIFFICULTIES.includes(form.difficulty)) list.push('Pick a difficulty.');
    if (!/^https?:\/\/\S+$/i.test(form.picture.trim())) list.push('Picture must be a full http(s) image URL.');
    return list;
  }, [form]);

  const canSave = problems.length === 0 && !saving;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const payload: HeroInput = {
      name: form.name.trim(),
      role: splitList(form.role).join('/'),
      lane: splitList(form.lane).join('/'),
      difficulty: form.difficulty,
      picture: form.picture.trim(),
    };
    try {
      if (isEdit) {
        await updateHero(heroId, payload);
        router.back();
      } else {
        const res = await createHero(payload);
        router.replace({ pathname: '/hero/[id]', params: { id: String(res.data.hero_id) } });
      }
    } catch (e) {
      setError(getErrorMessage(e));
      setSaving(false);
    }
  }

  const previewHero = {
    hero_id: isEdit ? heroId : 0,
    name: form.name || '?',
    picture: /^https?:\/\/\S+$/i.test(form.picture.trim()) ? form.picture.trim() : '',
    roles: splitList(form.role),
  };

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }];

  let body: ReactNode;
  if (isEdit && existing.loading) {
    body = <LoadingState message="Loading hero…" />;
  } else if (isEdit && (existing.error || !existing.hero)) {
    body = <ErrorState message={existing.error ?? 'Hero not found.'} onRetry={existing.reload} />;
  } else {
    body = (
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.previewRow}>
          <View style={[styles.preview, { borderColor: theme.border }]}>
            <HeroPortrait hero={previewHero} initialSize={36} />
          </View>
          <View style={styles.previewText}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {form.name || 'New hero'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Preview updates as you type
            </ThemedText>
          </View>
        </View>

        <Field label="Name">
          <TextInput
            value={form.name}
            onChangeText={set('name')}
            placeholder="e.g. Layla"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            maxLength={255}
            style={inputStyle}
          />
        </Field>

        <Field label="Role" hint="Tap to toggle, or type a new one. Separate several with /">
          <TextInput
            value={form.role}
            onChangeText={set('role')}
            placeholder="e.g. Mage/Tank"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            maxLength={255}
            style={inputStyle}
          />
          <View style={styles.chips}>
            {filters.roles.map((r) => (
              <Chip
                key={r}
                label={r}
                color={roleColor(r)}
                selected={splitList(form.role).includes(r)}
                onPress={() => set('role')(toggleInList(form.role, r))}
                small
              />
            ))}
          </View>
        </Field>

        <Field label="Lane" hint="Same as role: tap or type. Separate several with /">
          <TextInput
            value={form.lane}
            onChangeText={set('lane')}
            placeholder="e.g. Gold/EXP"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            maxLength={255}
            style={inputStyle}
          />
          <View style={styles.chips}>
            {filters.lanes.map((l) => (
              <Chip
                key={l}
                label={l}
                selected={splitList(form.lane).includes(l)}
                onPress={() => set('lane')(toggleInList(form.lane, l))}
                small
              />
            ))}
          </View>
        </Field>

        <Field label="Difficulty">
          <View style={styles.chips}>
            {DIFFICULTIES.map((d) => (
              <Chip
                key={d}
                label={d}
                color={difficultyColor(d)}
                selected={form.difficulty === d}
                onPress={() => set('difficulty')(d)}
              />
            ))}
          </View>
        </Field>

        <Field label="Picture URL" hint="A direct link to an image. It is stored as a link, never uploaded.">
          <TextInput
            value={form.picture}
            onChangeText={set('picture')}
            placeholder="https://…"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            maxLength={1000}
            style={inputStyle}
          />
        </Field>

        {error ? (
          <View style={[styles.banner, { backgroundColor: theme.backgroundElement, borderColor: theme.danger }]}>
            <Ionicons name="alert-circle-outline" size={18} color={theme.danger} />
            <ThemedText type="small" style={{ color: theme.danger, flex: 1 }}>
              {error}
            </ThemedText>
          </View>
        ) : problems.length > 0 && (form.name || form.role || form.lane || form.picture) ? (
          <ThemedText type="small" themeColor="textSecondary">
            {problems.join(' ')}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.tint },
            (!canSave || pressed) && styles.saveButtonDim,
          ]}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.saveLabel}>{isEdit ? 'Save changes' : 'Add hero'}</ThemedText>
          )}
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: isEdit ? 'Edit hero' : 'Add hero' }} />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  preview: {
    width: 72,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  previewText: {
    flex: 1,
    gap: Spacing.half,
  },
  field: {
    gap: Spacing.two,
  },
  fieldLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  input: {
    height: 46,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  saveButton: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDim: {
    opacity: 0.5,
  },
  saveLabel: {
    color: '#ffffff',
    fontWeight: 700,
  },
});
