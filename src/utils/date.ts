export const nowIso = (): string => new Date().toISOString();

export const isNewer = (a: string, b: string): boolean  => {
    return new Date(a).getTime() > new Date(b).getTime();
}