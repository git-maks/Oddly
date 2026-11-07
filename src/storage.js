export const SAVED_KEY = 'oddly.saved.v1';
export const MAX_SAVED = 100;

export function isValidEntry(entry) {
  return Boolean(entry && typeof entry.name === 'string' && entry.name.length <= 90 &&
    /^[A-Z][a-zA-Z]+$/.test(entry.name) && Array.isArray(entry.parts) &&
    entry.parts.length >= 2 && entry.parts.length <= 3 &&
    entry.parts.every((part) => typeof part === 'string' && /^[A-Z][a-zA-Z]+$/.test(part)) &&
    entry.parts.join('') === entry.name && Number.isInteger(entry.level) && entry.level >= 0 && entry.level <= 2);
}

export function loadSaved(storage) {
  try {
    const stored = JSON.parse(storage.getItem(SAVED_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    const names = new Set();
    return stored.filter((entry) => {
      if (!isValidEntry(entry) || names.has(entry.name)) return false;
      names.add(entry.name);
      return true;
    }).slice(0, MAX_SAVED);
  } catch { return []; }
}

export function persistSaved(storage, entries) {
  try { storage.setItem(SAVED_KEY, JSON.stringify(entries)); return true; }
  catch { return false; }
}
