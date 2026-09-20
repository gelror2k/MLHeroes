import { Directory, File, Paths } from 'expo-file-system';

import { loadJson, saveJson } from '@/services/storage';

/**
 * Device-local hero photos. A picture picked from the gallery is copied into
 * the app's document directory and remembered by file name per hero id.
 * Only the file name is stored: iOS moves the app container between installs,
 * which would break an absolute file:// URI.
 *
 * The server never sees these files. `picture` stays a URL column and image
 * binaries are never uploaded to the host (CLAUDE.md), so a photo picked here
 * shows on this phone only; other devices fall back to the URL or monogram.
 */
const STORAGE_KEY = 'portraits';
const FOLDER = 'portraits';

/** hero_id -> file name inside the portraits folder. */
export type PortraitMap = Record<string, string>;

function folder(): Directory {
  return new Directory(Paths.document, FOLDER);
}

export function portraitUri(fileName: string): string {
  return new File(folder(), fileName).uri;
}

/** The saved map, minus entries whose file has since disappeared. Never throws. */
export async function loadPortraits(): Promise<PortraitMap> {
  const saved = (await loadJson<PortraitMap>(STORAGE_KEY)) ?? {};
  const alive: PortraitMap = {};
  try {
    const dir = folder();
    if (!dir.exists) return alive;
    for (const [id, name] of Object.entries(saved)) {
      if (typeof name === 'string' && new File(dir, name).exists) alive[id] = name;
    }
  } catch {
    // File system unavailable (e.g. web): behave as if nothing is saved.
  }
  return alive;
}

export function savePortraits(map: PortraitMap): Promise<void> {
  return saveJson(STORAGE_KEY, map);
}

/**
 * Copy a picked image into the portraits folder and return its file name.
 * The picker hands back a cache URI the OS may clear, hence the copy. A
 * timestamp in the name gives every pick a fresh URI so expo-image's disk
 * cache never shows the previous photo.
 */
export async function copyPortrait(heroId: number, sourceUri: string): Promise<string> {
  const source = new File(sourceUri);
  const name = `${heroId}-${Date.now()}${source.extension || '.jpg'}`;
  const dir = folder();
  dir.create({ idempotent: true, intermediates: true });
  await source.copy(new File(dir, name));
  return name;
}

/** Best-effort delete of a stored portrait file. */
export function deletePortraitFile(fileName: string): void {
  try {
    const file = new File(folder(), fileName);
    if (file.exists) file.delete();
  } catch {
    // Already gone or unreadable; dropping the map entry is what matters.
  }
}
