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

/**
 * Returns false if the write did not happen (storage full, quota refused, web
 * private mode). Callers that show the value back to the user should react to
 * that rather than leave the screen claiming something was saved when it wasn't.
 */
export async function saveJson<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`storage: could not save "${key}"`, e);
    return false;
  }
}
