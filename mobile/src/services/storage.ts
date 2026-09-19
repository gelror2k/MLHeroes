import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin JSON wrapper over AsyncStorage. Every read/write is wrapped so a
 * storage failure never crashes a screen; it just behaves like "nothing saved".
 */
const PREFIX = '@mlheroes/';

export async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore: caching and favorites are best-effort on device.
  }
}
