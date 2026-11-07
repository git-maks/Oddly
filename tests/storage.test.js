import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSaved, persistSaved, MAX_SAVED } from '../src/storage.js';

const entry = { name: 'QuietOtter', parts: ['Quiet', 'Otter'], level: 0 };
const storage = (value) => ({ getItem: () => value });

test('malformed, blocked, or unavailable storage never prevents generation', () => {
  for (const value of ['broken JSON', '{}', 'null', '42']) assert.deepEqual(loadSaved(storage(value)), []);
  assert.deepEqual(loadSaved(undefined), []);
  assert.deepEqual(loadSaved({ getItem() { throw new Error('Blocked'); } }), []);
  assert.equal(persistSaved(undefined, [entry]), false);
});

test('favorites ignore duplicates and reject invalid or injected entries', () => {
  const invalid = [null, { ...entry, parts: ['<img src=x>', 'Otter'] }, { ...entry, name: 'OtherOtter' }, { ...entry, level: 9 }, { ...entry, name: 'a'.repeat(100) }];
  assert.deepEqual(loadSaved(storage(JSON.stringify([entry, entry, ...invalid]))), [entry]);
});

test('favorite imports have a fixed size limit', () => {
  const many = Array.from({ length: 120 }, (_, i) => {
    const suffix = String.fromCharCode(65 + Math.floor(i / 26), 65 + i % 26);
    return { name: `QuietOtter${suffix}`, parts: ['Quiet', `Otter${suffix}`], level: 0 };
  });
  assert.equal(loadSaved(storage(JSON.stringify(many))).length, MAX_SAVED);
});
