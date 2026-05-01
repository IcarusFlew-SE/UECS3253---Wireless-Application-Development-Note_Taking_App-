export const logger = {
    info: (...args: unknown[]) => console.log('[NoteNest]', ...args),
    error: (...args: unknown[]) => console.error('[NoteNest Error]', ...args),
    warn: (...args: unknown[]) => console.warn('[NoteNest Warn]', ...args),
    debug: (...args: unknown[]) => console.debug('[NoteNest Debug]', ...args),
}