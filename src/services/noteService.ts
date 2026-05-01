import { Note, ValidationResult } from '../types';
import { loadNotes, saveNotes } from './storageService';

// Generate a simple unique ID using timestamp + random suffix.
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Return the current time as an ISO string.
function now(): string {
  return new Date().toISOString();
}

/**
 * Validate note input before any create or update operation.
 * Returns { valid: true } when all checks pass, or { valid: false, error: '...' }.
 */
export function validateNote(
  title: string,
  content: string,
): ValidationResult {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (trimmedTitle.length === 0) {
    return { valid: false, error: 'Title cannot be empty.' };
  }
  if (trimmedTitle.length > 100) {
    return { valid: false, error: 'Title must be 100 characters or fewer.' };
  }
  if (trimmedContent.length === 0) {
    return { valid: false, error: 'Content cannot be empty.' };
  }
  if (trimmedContent.length < 3) {
    return { valid: false, error: 'Content must be at least 3 characters.' };
  }

  return { valid: true };
}

// Create a new note and persist it to AsyncStorage.
export async function createNote(
  title: string,
  content: string,
  category: string = 'General',
  tags: string[] = [],
): Promise<Note | null> {
  // Validate first
  const validation = validateNote(title, content);
  if (!validation.valid) {
    console.warn('[noteService] createNote validation failed:', validation.error);
    return null;
  }

  const newNote: Note = {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
    category: category.trim() || 'General',
    tags: tags.map(t => t.trim()).filter(t => t.length > 0),
    createdAt: now(),
    updatedAt: now(),
    isSynced: false,
  };

  // Load existing notes, append, then save
  const notes = await loadNotes<Note>();
  notes.unshift(newNote); // newest first
  const saved = await saveNotes<Note>(notes);

  if (!saved) {
    console.error('[noteService] createNote: failed to save to AsyncStorage');
    return null;
  }

  console.log('[noteService] Note created:', newNote.id);
  return newNote;
}

// Load and return all notes
export async function getAllNotes(): Promise<Note[]> {
  const notes = await loadNotes<Note>();
  // Sort by updatedAt descending (newest first)
  return notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/**
 * Find and return a single note by its ID.
 * Returns null when the note is not found.
 */
export async function getNoteById(id: string): Promise<Note | null> {
  if (!id) return null;
  const notes = await loadNotes<Note>();
  return notes.find(n => n.id === id) ?? null;
}

//Update an existing note's title, content, category and/or tags.

export async function updateNote(
  id: string,
  title: string,
  content: string,
  category?: string,
  tags?: string[],
): Promise<Note | null> {
  // Validate
  const validation = validateNote(title, content);
  if (!validation.valid) {
    console.warn('[noteService] updateNote validation failed:', validation.error);
    return null;
  }

  const notes = await loadNotes<Note>();
  const index = notes.findIndex(n => n.id === id);

  if (index === -1) {
    console.warn('[noteService] updateNote: note not found:', id);
    return null;
  }

  // Merge changes
  const updatedNote: Note = {
    ...notes[index],
    title: title.trim(),
    content: content.trim(),
    category: category !== undefined ? category.trim() || 'General' : notes[index].category,
    tags: tags !== undefined
      ? tags.map(t => t.trim()).filter(t => t.length > 0)
      : notes[index].tags,
    updatedAt: now(),
    isSynced: false, // mark as dirty for future cloud sync
  };

  notes[index] = updatedNote;
  const saved = await saveNotes<Note>(notes);

  if (!saved) {
    console.error('[noteService] updateNote: failed to save to AsyncStorage');
    return null;
  }

  console.log('[noteService] Note updated:', id);
  return updatedNote;
}

// -----------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------

//Delete a note by its ID.
export async function deleteNote(id: string): Promise<boolean> {
  if (!id) return false;

  const notes = await loadNotes<Note>();
  const filtered = notes.filter(n => n.id !== id);

  if (filtered.length === notes.length) {
    console.warn('[noteService] deleteNote: note not found:', id);
    return false; // nothing was removed
  }

  const saved = await saveNotes<Note>(filtered);
  if (!saved) {
    console.error('[noteService] deleteNote: failed to save to AsyncStorage');
    return false;
  }

  console.log('[noteService] Note deleted:', id);
  return true;
}

/**
 * Search notes by matching the query string against title and content.
 * Case-insensitive, returns newest first.
 */
export async function searchNotes(query: string): Promise<Note[]> {
  if (!query.trim()) return getAllNotes();

  const notes = await loadNotes<Note>();
  const lower = query.toLowerCase();

  return notes
    .filter(
      n =>
        n.title.toLowerCase().includes(lower) ||
        n.content.toLowerCase().includes(lower) ||
        n.tags.some(t => t.toLowerCase().includes(lower)),
    )
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}