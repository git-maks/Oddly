import { cleanAdjectives, rareAdjectives, cleanAnimals, allAdjectives, allAnimals, prefixes, middles, endings } from './words.js';

export const LEVELS = Object.freeze([
  Object.freeze({
    id: 'clean', name: 'Clean',
    description: 'Familiar words. Easy to say, easy to remember. A classic for a reason.',
    recipe: ['Adjective', 'Animal'],
    subtitle: 'A good name is a fresh start.',
    note: 'Small words. Plenty of personality.',
    combinations: BigInt(cleanAdjectives.length) * BigInt(cleanAnimals.length),
  }),
  Object.freeze({
    id: 'curious', name: 'Curious',
    description: 'A wider vocabulary. An extra adjective. For the pleasantly unexpected.',
    recipe: ['Adjective', 'Adjective', 'Animal'],
    subtitle: 'A little less ordinary. A little more you.',
    note: 'Two adjectives. A much bigger playground.',
    combinations: BigInt(allAdjectives.length) * BigInt(allAdjectives.length - 1) * BigInt(allAnimals.length),
  }),
  Object.freeze({
    id: 'wild', name: 'Wild',
    description: 'Invented words meet obscure animals. Longer, stranger, harder to stumble upon.',
    recipe: ['Invented', 'Rare adjective', 'Animal'],
    subtitle: 'Strange is a perfectly good place to start.',
    note: 'Invented syllables. Billions of word recipes.',
    combinations: BigInt(prefixes.length) * BigInt(middles.length) * BigInt(endings.length) * BigInt(rareAdjectives.length) * BigInt(allAnimals.length),
  }),
]);

const UINT32_RANGE = 2 ** 32;

// Rejection sampling avoids the modulo bias of randomValue % max.
export function secureRandomInt(max, cryptoSource = globalThis.crypto) {
  if (!Number.isSafeInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError('Random range must be an integer between 1 and 2^32.');
  }
  if (!cryptoSource?.getRandomValues) {
    throw new Error('Your browser does not support secure random generation. Try a current browser over HTTPS or localhost.');
  }
  const buffer = new Uint32Array(1);
  const limit = UINT32_RANGE - (UINT32_RANGE % max);
  do { cryptoSource.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % max;
}

export function createGenerator({ randomInt = secureRandomInt, recentLimit = 2000 } = {}) {
  if (!Number.isInteger(recentLimit) || recentLimit < 0 || recentLimit >= LEVELS[0].combinations) {
    throw new RangeError('Invalid recent-name window.');
  }
  const recent = new Set();
  const queue = [];
  const pick = (items) => items[randomInt(items.length)];

  function candidate(level) {
    if (level === 0) return [pick(cleanAdjectives), pick(cleanAnimals)];
    if (level === 1) {
      const first = randomInt(allAdjectives.length);
      const second = (first + 1 + randomInt(allAdjectives.length - 1)) % allAdjectives.length;
      return [allAdjectives[first], allAdjectives[second], pick(allAnimals)];
    }
    const invented = pick(prefixes) + pick(middles) + pick(endings);
    return [invented[0].toUpperCase() + invented.slice(1), pick(rareAdjectives), pick(allAnimals)];
  }

  function generate(level = 0) {
    if (!Number.isInteger(level) || !LEVELS[level]) throw new RangeError('Unknown obscurity level.');
    for (let attempt = 0; attempt < 100; attempt++) {
      const parts = candidate(level);
      const name = parts.join('');
      if (recent.has(name)) continue;
      recent.add(name);
      queue.push(name);
      if (queue.length > recentLimit) recent.delete(queue.shift());
      return Object.freeze({ name, parts: Object.freeze(parts), level });
    }
    throw new Error('Could not find a fresh name. Please try again.');
  }

  return Object.freeze({ generate });
}

export function formatCombinations(value) {
  if (value >= 1_000_000_000n) return `${(Number(value) / 1e9).toFixed(1)} billion`;
  if (value >= 1_000_000n) return `${(Number(value) / 1e6).toFixed(1)} million`;
  return new Intl.NumberFormat('en-US').format(value);
}
