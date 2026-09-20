import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { HeroPortrait } from '@/components/hero-portrait';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { SectionCard } from '@/components/section-card';
import { ErrorState, LoadingState } from '@/components/state-views';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useToast } from '@/components/toast';
import { difficultyColor, roleColor } from '@/constants/roleColors';
import { Gutter, Radius, Spacing } from '@/constants/theme';
import { useFilters } from '@/hooks/use-filters';
import { useHero } from '@/hooks/use-hero';
import { usePortraits } from '@/hooks/use-portraits';
import { useTheme } from '@/hooks/use-theme';
import { createHero, deleteHero, updateHero } from '@/services/heroService';
import type { Hero, HeroInput } from '@/types/hero';

// The API accepts exactly these; it's a data convention, not a filter list.
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// `picture` is the server-side image link. The form never edits it directly any more:
// it is kept from the loaded hero and cleared by "Remove", while new portraits are
// photos stored on this device (see hooks/use-portraits).
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

function normalise(form: HeroInput): HeroInput {
  return {
    name: form.name.trim(),
    role: splitList(form.role).join('/'),
    lane: splitList(form.lane).join('/'),
    difficulty: form.difficulty,
    picture: form.picture.trim(),
  };
}

function toInput(hero: Hero): HeroInput {
  const { name, role, lane, difficulty, picture } = hero;
  return { name, role, lane, difficulty, picture };
}

type Touched = Partial<Record<keyof HeroInput, boolean>>;
type Problems = Partial<Record<keyof HeroInput, string>>;

function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.chips}>{children}</View>;
}

/**
 * The form itself. Mounted only once the hero to edit (if any) has loaded, so
 * its state starts from the right values and never needs re-syncing.
 */
function HeroEditor({ hero }: { hero: Hero | null }) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { filters } = useFilters();
  const { portraitFor, setPortrait, clearPortrait } = usePortraits();
  const isEdit = hero !== null;

  const [initial] = useState<HeroInput>(() => (hero ? toInput(hero) : EMPTY));
  const [form, setForm] = useState<HeroInput>(initial);
  const [touched, setTouched] = useState<Touched>({});
  // Device photo shown for this hero: the stored one on open, then whatever was picked. null = none.
  const [initialPhoto] = useState<string | null>(() => (hero ? portraitFor(hero.hero_id) : null));
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (key: keyof HeroInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const touch = (key: keyof HeroInput) => () => setTouched((t) => ({ ...t, [key]: true }));

  const problems = useMemo<Problems>(() => {
    const p: Problems = {};
    if (!form.name.trim()) p.name = 'Name is required.';
    if (splitList(form.role).length === 0) p.role = 'At least one role is required.';
    if (splitList(form.lane).length === 0) p.lane = 'At least one lane is required.';
    if (!DIFFICULTIES.includes(form.difficulty)) p.difficulty = 'Pick a difficulty.';
    return p;
  }, [form]);

  const valid = Object.keys(problems).length === 0;
  const recordDirty = JSON.stringify(normalise(form)) !== JSON.stringify(normalise(initial));
  const photoDirty = photo !== initialPhoto;
  const dirty = recordDirty || photoDirty;
  const canSave = valid && !saving && (!isEdit || dirty);

  async function choosePhoto() {
    setPicking(true);
    try {
      // The system picker needs no permission prompt for the photo library on either platform.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      const asset = result.canceled ? null : result.assets[0];
      if (asset) setPhoto(asset.uri);
    } catch (e) {
      toast.show(getErrorMessage(e), 'danger');
    } finally {
      setPicking(false);
    }
  }

  /** Drop both the device photo and the server-side image link; the hero shows a monogram. */
  function removePicture() {
    setPhoto(null);
    set('picture')('');
  }

  /** Store or drop the device photo once the record exists. Resolves false if the file copy failed. */
  async function persistPhoto(heroId: number): Promise<boolean> {
    if (!photoDirty) return true;
    try {
      if (photo) await setPortrait(heroId, photo);
      else clearPortrait(heroId);
      return true;
    } catch {
      return false;
    }
  }

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const payload = normalise(form);
    try {
      // A photo-only change on an existing hero never touches the API.
      let saved: Hero;
      if (hero === null) saved = (await createHero(payload)).data;
      else if (recordDirty) saved = (await updateHero(hero.hero_id, payload)).data;
      else saved = hero;

      const stored = await persistPhoto(saved.hero_id);
      if (!stored) {
        toast.show(`${payload.name} saved, but the photo could not be stored on this device.`, 'danger');
      } else {
        toast.show(hero ? `${payload.name} updated.` : `${payload.name} added to the roster.`);
      }
      if (hero) router.back();
      else router.replace({ pathname: '/hero/[id]', params: { id: String(saved.hero_id) } });
    } catch (e) {
      setError(getErrorMessage(e));
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!hero) return;
    setDeleting(true);
    try {
      await deleteHero(hero.hero_id);
      toast.show(`${hero.name} removed from the database.`);
      setConfirming(false);
      // Pop the form and the detail screen beneath it; the hero no longer exists.
      router.dismissTo('/');
    } catch (e) {
      toast.show(getErrorMessage(e), 'danger');
      setDeleting(false);
    }
  }

  const pictureUrl = form.picture.trim();
  const hasPortrait = photo !== null || pictureUrl !== '';
  const previewHero = {
    hero_id: hero?.hero_id ?? 0,
    name: form.name.trim() || '?',
    picture: pictureUrl,
    roles: splitList(form.role),
  };
  const portraitNote = photo
    ? 'Photo from your gallery. It is kept on this phone only.'
    : pictureUrl
      ? 'Portrait loads from the saved image link.'
      : 'No portrait yet. Choose a photo from your gallery.';

  return (
    <>
      <ScreenHeader
        back="close"
        backLabel="Cancel and go back"
        title={isEdit ? 'Edit hero' : 'New hero'}
        right={
          dirty ? (
            <View style={[styles.pill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
              <ThemedText type="eyebrow" themeColor="accent" style={{ letterSpacing: 0.9 }}>
                Unsaved
              </ThemedText>
            </View>
          ) : undefined
        }
      />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.preview, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.previewRow}>
              <HeroPortrait hero={previewHero} uri={photo ?? pictureUrl} size={64} />
              <View style={styles.previewText}>
                <ThemedText type="bodyStrong" numberOfLines={1}>
                  {form.name.trim() || 'New hero'}
                </ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  {portraitNote}
                </ThemedText>
              </View>
            </View>
            <View style={styles.previewActions}>
              <Button
                label={hasPortrait ? 'Change photo' : 'Choose photo'}
                icon="image"
                variant="secondary"
                compact
                loading={picking}
                disabled={saving}
                onPress={choosePhoto}
                style={styles.previewAction}
              />
              {hasPortrait ? (
                <Button
                  label="Remove"
                  icon="x"
                  variant="danger"
                  compact
                  disabled={saving || picking}
                  onPress={removePicture}
                  style={styles.previewAction}
                />
              ) : null}
            </View>
          </View>

          <TextField
            label="Hero name"
            value={form.name}
            onChangeText={set('name')}
            onBlur={touch('name')}
            error={touched.name ? problems.name : null}
            placeholder="e.g. Layla"
            autoCapitalize="words"
            maxLength={255}
          />

          <View style={styles.field}>
            <TextField
              label="Role"
              value={form.role}
              onChangeText={set('role')}
              onBlur={touch('role')}
              error={touched.role ? problems.role : null}
              hint="Tap a chip or type a new role. Separate several with /"
              placeholder="e.g. Mage/Tank"
              autoCapitalize="words"
              maxLength={255}
            />
            <ChipRow>
              {filters.roles.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  color={roleColor(r)}
                  selected={splitList(form.role).includes(r)}
                  onPress={() => {
                    set('role')(toggleInList(form.role, r));
                    touch('role')();
                  }}
                />
              ))}
            </ChipRow>
          </View>

          <View style={styles.field}>
            <TextField
              label="Lane"
              value={form.lane}
              onChangeText={set('lane')}
              onBlur={touch('lane')}
              error={touched.lane ? problems.lane : null}
              hint="Same as role: tap or type. Separate several with /"
              placeholder="e.g. Gold/EXP"
              autoCapitalize="words"
              maxLength={255}
            />
            <ChipRow>
              {filters.lanes.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={splitList(form.lane).includes(l)}
                  onPress={() => {
                    set('lane')(toggleInList(form.lane, l));
                    touch('lane')();
                  }}
                />
              ))}
            </ChipRow>
          </View>

          <View style={styles.field}>
            <ThemedText type="eyebrow" themeColor="textMuted" style={styles.label}>
              Difficulty
            </ThemedText>
            <View style={styles.segmented}>
              {DIFFICULTIES.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  color={difficultyColor(d)}
                  selected={form.difficulty === d}
                  onPress={() => set('difficulty')(d)}
                  style={styles.segment}
                />
              ))}
            </View>
          </View>

          {error ? (
            <View style={[styles.banner, { backgroundColor: theme.dangerSoft, borderColor: theme.dangerBorder }]}>
              <Feather name="alert-circle" size={18} color={theme.danger} />
              <ThemedText type="small" style={[styles.bannerText, { color: theme.danger }]}>
                {error}
              </ThemedText>
            </View>
          ) : null}

          {hero ? (
            <SectionCard title="Danger zone" gap={Spacing.md}>
              <ThemedText type="caption" themeColor="textMuted">
                Deleting removes this record and its skill rows. There is no undo.
              </ThemedText>
              <Button label="Delete this record" icon="trash-2" variant="danger" compact onPress={() => setConfirming(true)} />
            </SectionCard>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            { backgroundColor: theme.backgroundBar, borderTopColor: theme.border, paddingBottom: Spacing.md + insets.bottom },
          ]}>
          <Button label="Cancel" variant="secondary" onPress={() => router.back()} disabled={saving} style={styles.cancel} />
          <Button
            label={isEdit ? 'Save changes' : 'Add hero'}
            onPress={save}
            loading={saving}
            disabled={!canSave}
            style={styles.save}
          />
        </View>
      </KeyboardAvoidingView>

      {hero ? (
        <ConfirmDialog
          visible={confirming}
          title={`Delete ${hero.name}?`}
          message="This removes the hero record and its linked skill rows from the database. The action cannot be undone."
          hero={hero}
          busy={deleting}
          onCancel={() => (deleting ? undefined : setConfirming(false))}
          onConfirm={confirmDelete}
        />
      ) : null}
    </>
  );
}

/**
 * Create a hero (no `id` param) or edit one (`?id=12`).
 * Role and lane are free text with quick-toggle chips from filters.php, so
 * existing values are one tap and new ones can still be typed.
 */
export default function HeroFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const heroId = id ? Number(id) : NaN;
  const isEdit = Number.isInteger(heroId) && heroId > 0;
  const existing = useHero(isEdit ? heroId : NaN);

  let body: ReactNode;
  if (!isEdit) {
    body = <HeroEditor hero={null} />;
  } else if (existing.loading) {
    body = (
      <>
        <ScreenHeader back="close" backLabel="Cancel and go back" title="Edit hero" />
        <LoadingState message="Loading hero…" />
      </>
    );
  } else if (existing.error || !existing.hero) {
    body = (
      <>
        <ScreenHeader back="close" backLabel="Cancel and go back" title="Edit hero" />
        <ErrorState message={existing.error ?? 'Hero not found.'} onRetry={existing.reload} />
      </>
    );
  } else {
    body = <HeroEditor key={existing.hero.hero_id} hero={existing.hero} />;
  }

  return <Screen>{body}</Screen>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  preview: {
    gap: 14,
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  previewText: {
    flex: 1,
    gap: Spacing.xs,
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  previewAction: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  field: {
    gap: Spacing.sm + 2,
  },
  label: {
    letterSpacing: 1.1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  segmented: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    padding: Spacing.md,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  bannerText: {
    flex: 1,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    paddingHorizontal: Gutter,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  cancel: {
    flex: 1,
  },
  save: {
    flex: 2,
  },
});
