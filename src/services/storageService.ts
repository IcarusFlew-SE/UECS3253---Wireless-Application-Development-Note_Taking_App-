import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@NoteNester:notes';

/**
 * Load the raw JSON string from AsyncStorage and parse it.
 * Returns an empty array when nothing has been saved yet.
 */
export async function loadRaw<T>(key: string): Promise<T[]> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return [];
    return JSON.parse(json) as T[];
  } catch (error) {
    console.error(`[storageService] Failed to load key "${key}":`, error);
    return [];
  }
}

export async function saveRaw<T>(key: string, data: T[]): Promise<boolean> {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(key, json);
    return true;
  } catch (error) {
    console.error(`[storageService] Failed to save key "${key}":`, error);
    return false;
  }
}

export async function clearKey(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storageService] Failed to clear key "${key}":`, error);
    return false;
  }
}

// Load all notes from AsyncStorage.
export const loadNotes = <T>() => loadRaw<T>(NOTES_STORAGE_KEY);

// Persist the full notes array to AsyncStorage.
export const saveNotes = <T>(notes: T[]) => saveRaw<T>(NOTES_STORAGE_KEY, notes);

// Wipe all notes from AsyncStorage.
export const clearAllNotes = () => clearKey(NOTES_STORAGE_KEY);