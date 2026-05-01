export type NoteCategory = 'Work' | 'Personal' | 'Ideas' | 'Study' | 'General';

export interface Note {
    id: string;
    title: string;
    body: string;
    category: NoteCategory;
    color: string;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface InsertNoteInput {
    id?: string;
    title: string;
    body: string;
    category?: NoteCategory;
    color?: string;
    isPinned?: boolean;
}

export interface CloudSyncPayload {
    deviceId: string;
    notes: Note[];
    lastSyncedAt?: string;
}