import test from 'node:test';
import assert from 'node:assert/strict';
import { createGenerator, LEVELS, secureRandomInt, countCombinations } from '../src/generator.js';
import { allAdjectives, allAnimals, cleanAdjectives, cleanAnimals, rareAdjectives, prefixes, middles, endings } from '../src/words.js';

test('the default recipe has tens of thousands of choices; Wild has billions', () => {
  assert.ok(LEVELS[0].combinations > 50_000n);
  assert.ok(LEVELS[1].combinations > 50_000_000n);
  assert.ok(LEVELS[2].combinations > 10_000_000_000n);
  assert.ok(LEVELS[0].combinations < LEVELS[1].combinations);
  assert.ok(LEVELS[1].combinations < LEVELS[2].combinations);
});

test('word banks have no duplicate entries; invented word boundaries are unambiguous', () => {
  for (const bank of [allAdjectives, allAnimals, cleanAdjectives, cleanAnimals, prefixes, middles, endings]) {
    assert.equal(new Set(bank).size, bank.length);
    assert.ok(bank.every((word) => /^[a-zA-Z]+$/.test(word)));
  }
  for (const [bank, width] of [[prefixes, 3], [middles, 2], [endings, 3]]) assert.ok(bank.every((word) => word.length === width));
});

test('all modes generate platform-friendly PascalCase without repeats in their protected window', () => {
  for (const level of [0, 1, 2]) {
    const generator = createGenerator();
    const names = new Set();
    for (let i = 0; i < 2000; i++) {
      const entry = generator.generate(level);
      assert.match(entry.name, /^[A-Z][a-zA-Z]+$/);
      assert.equal(entry.parts.join(''), entry.name);
      assert.equal(entry.parts.length, level === 0 ? 2 : 3);
      assert.equal(names.has(entry.name), false);
      assert.ok(entry.name.length < 64);
      if (level === 1) assert.notEqual(entry.parts[0], entry.parts[1]);
      if (level === 2) assert.equal(entry.parts[0].length, 8);
      names.add(entry.name);
    }
  }
});

test('recent duplicates are skipped, while names outside the window can be reused', () => {
  const values = [0, 0, 0, 0, 1, 0, 2, 0, 0, 0];
  const generator = createGenerator({ randomInt: () => values.shift(), recentLimit: 2 });
  const first = generator.generate();
  assert.notEqual(generator.generate().name, first.name);
  assert.notEqual(generator.generate().name, first.name);
  assert.equal(generator.generate().name, first.name);
});

test('optional alliteration matches every component across all levels and keeps recent names fresh', () => {
  for (const level of [0, 1, 2]) {
    const generator = createGenerator();
    const names = new Set();
    for (let i = 0; i < 2000; i++) {
      const entry = generator.generate(level, { alliteration: true });
      assert.ok(entry.parts.every((part) => part[0] === entry.parts[0][0]), entry.name);
      assert.equal(names.has(entry.name), false);
      if (level === 1) assert.notEqual(entry.parts[0], entry.parts[1]);
      if (level === 2) assert.equal(entry.parts[0].length, 8);
      names.add(entry.name);
    }
  }
});

test('alliterative counts match independently counted eligible recipes', () => {
  const sameInitial = (bank, letter) => bank.filter((word) => word[0].toUpperCase() === letter).length;
  let clean = 0n, curious = 0n, wild = 0n;
  // Count by animal, independently of the generator's letter grouping.
  for (const animal of cleanAnimals) clean += BigInt(sameInitial(cleanAdjectives, animal[0]));
  for (const animal of allAnimals) {
    const count = sameInitial(allAdjectives, animal[0]);
    curious += BigInt(count * (count - 1));
    wild += BigInt(sameInitial(prefixes, animal[0]) * sameInitial(rareAdjectives, animal[0])) * BigInt(middles.length * endings.length);
  }
  for (const [level, expected] of [clean, curious, wild].entries()) {
    assert.equal(countCombinations(level, { alliteration: true }), expected);
    assert.ok(expected > 2000n);
    assert.ok(expected < countCombinations(level));
    assert.equal(countCombinations(level), LEVELS[level].combinations);
  }
});

test('alliteration is opt-in and repeat protection also applies when switching it', () => {
  const choices = [0, cleanAnimals.length - 1];
  const mixed = createGenerator({ randomInt: () => choices.shift(), recentLimit: 0 }).generate();
  assert.notEqual(new Set(mixed.parts.map((part) => part[0])).size, 1);
  const generator = createGenerator();
  const names = new Set();
  for (let i = 0; i < 2000; i++) {
    const entry = generator.generate(i % 3, { alliteration: i % 2 === 0 });
    assert.equal(names.has(entry.name), false);
    names.add(entry.name);
  }
});

test('rejection sampling retries the biased tail of uint32 instead of returning it', () => {
  const values = [0xffffffff, 12];
  const source = { getRandomValues(buffer) { buffer[0] = values.shift(); return buffer; } };
  assert.equal(secureRandomInt(10, source), 2);
  assert.equal(values.length, 0);
  assert.equal(secureRandomInt(1), 0);
  assert.ok(secureRandomInt(2 ** 32) < 2 ** 32);
});

test('invalid levels and unusable entropy fail clearly', () => {
  for (const level of [-1, 3, '1', NaN, .5]) assert.throws(() => createGenerator().generate(level), RangeError);
  for (const max of [0, -1, .5, 2 ** 32 + 1]) assert.throws(() => secureRandomInt(max), RangeError);
  assert.throws(() => secureRandomInt(10, {}), /secure random/);
  const stuck = createGenerator({ randomInt: () => 0 });
  stuck.generate();
  assert.throws(() => stuck.generate(), /fresh name/);
});
