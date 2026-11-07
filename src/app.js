import { createGenerator, LEVELS, formatCombinations, countCombinations } from './generator.js';
import { loadSaved, persistSaved, MAX_SAVED, SAVED_KEY } from './storage.js';

const $ = (selector) => document.querySelector(selector);
const engine = createGenerator();
const history = [];
let browserStorage;
try { browserStorage = window.localStorage; } catch { /* Private browser policies may block storage. */ }
let saved = loadSaved(browserStorage);
let level = 0;
let alliteration = false;
let current;
let toastTimer;
let copyTimer;
const icons = { copy: '#i-copy', bookmark: '#i-bookmark', check: '#i-check' };

function icon(kind) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', icons[kind]);
  svg.append(use);
  return svg;
}

function notify(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function nameContent(entry) {
  const fragment = document.createDocumentFragment();
  entry.parts.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = index === entry.parts.length - 1 ? 'animal-word' : 'name-word';
    span.textContent = word;
    fragment.append(span);
    if (index < entry.parts.length - 1) fragment.append(document.createElement('wbr'));
  });
  return fragment;
}

function isSaved(name) { return saved.some((entry) => entry.name === name); }

function updateSaveButtons() {
  $('#saved-count').textContent = saved.length;
  $('#dialog-saved-count').textContent = String(saved.length).padStart(2, '0');
  $('#export-saved').disabled = saved.length === 0;
  if (current) {
    const active = isSaved(current.name);
    $('#save-current').setAttribute('aria-pressed', active);
    $('#save-current').setAttribute('aria-label', `${active ? 'Unsave' : 'Save'} ${current.name}`);
  }
  document.querySelectorAll('[data-save-name]').forEach((button) => {
    const active = isSaved(button.dataset.saveName);
    button.setAttribute('aria-pressed', active);
    button.setAttribute('aria-label', `${active ? 'Unsave' : 'Save'} ${button.dataset.saveName}`);
  });
}

function toggleSaved(entry) {
  if (isSaved(entry.name)) saved = saved.filter((item) => item.name !== entry.name);
  else {
    if (saved.length >= MAX_SAVED) return notify('Your collection is full. Remove a name to save another.');
    saved = [entry, ...saved];
  }
  const persisted = persistSaved(browserStorage, saved);
  notify(persisted ? (isSaved(entry.name) ? 'Saved to your keepers.' : 'Removed from saved names.') : 'Browser storage is unavailable. Favorites will last for this tab only.');
  updateSaveButtons();
  renderSaved();
}

async function copyName(name, button) {
  try {
    await navigator.clipboard.writeText(name);
    notify(`${name} copied.`);
    if (button === $('#copy-current')) {
      clearTimeout(copyTimer);
      button.replaceChildren(icon('check'), Object.assign(document.createElement('span'), { textContent: 'Copied!' }));
      copyTimer = setTimeout(resetCopyButton, 1600);
    }
  } catch {
    // A selectable field also works when clipboard permission is denied.
    const selectionDialog = document.createElement('dialog');
    selectionDialog.setAttribute('aria-label', 'Copy name manually');
    const label = Object.assign(document.createElement('p'), { textContent: 'Select and copy your name:' });
    const field = Object.assign(document.createElement('input'), { type: 'text', value: name, readOnly: true });
    field.setAttribute('aria-label', 'Name to copy');
    field.style.cssText = 'display:block;width:100%;margin:18px 0;padding:12px;border:1px solid #bdc8ac;border-radius:5px;background:#fff;color:#253e32';
    const close = Object.assign(document.createElement('button'), { className: 'batch-button', textContent: 'Done' });
    close.addEventListener('click', () => selectionDialog.close());
    selectionDialog.append(label, field, close);
    selectionDialog.addEventListener('close', () => selectionDialog.remove(), { once: true });
    document.body.append(selectionDialog);
    selectionDialog.showModal();
    field.focus();
    field.select();
  }
}

function resetCopyButton() {
  clearTimeout(copyTimer);
  $('#copy-current').replaceChildren(icon('copy'), Object.assign(document.createElement('span'), { textContent: 'Copy name' }));
}

function row(entry) {
  const item = document.createElement('div');
  item.className = 'name-row';
  const text = document.createElement('span');
  text.className = 'row-name';
  text.append(nameContent(entry));
  const actions = document.createElement('div');
  actions.className = 'row-actions';
  const copy = document.createElement('button');
  copy.className = 'icon-button';
  copy.setAttribute('aria-label', `Copy ${entry.name}`);
  copy.append(icon('copy'));
  copy.addEventListener('click', () => copyName(entry.name, copy));
  const save = document.createElement('button');
  save.className = 'icon-button';
  save.dataset.saveName = entry.name;
  save.setAttribute('aria-label', `${isSaved(entry.name) ? 'Unsave' : 'Save'} ${entry.name}`);
  save.setAttribute('aria-pressed', isSaved(entry.name));
  save.append(icon('bookmark'));
  save.addEventListener('click', () => {
    const inSavedDialog = save.closest('dialog');
    const index = inSavedDialog ? saved.findIndex((item) => item.name === entry.name) : -1;
    toggleSaved(entry);
    if (inSavedDialog) {
      const buttons = [...$('#saved-list').querySelectorAll('[data-save-name]')];
      (buttons[Math.min(index, buttons.length - 1)] || $('#export-saved:not(:disabled)') || $('[data-close="saved-dialog"]')).focus();
    }
  });
  actions.append(copy, save);
  item.append(text, actions);
  return item;
}

function renderHistory() {
  $('#recent-list').replaceChildren(...history.map(row));
  $('#recent-count').textContent = String(history.length).padStart(2, '0');
  $('#export-recent').disabled = history.length === 0;
}

function renderSaved() {
  const list = $('#saved-list');
  if (saved.length) list.replaceChildren(...saved.map(row));
  else {
    const empty = document.createElement('div');
    empty.className = 'empty-saved';
    empty.append(icon('bookmark'), Object.assign(document.createElement('strong'), { textContent: 'Nothing saved. Yet.' }), Object.assign(document.createElement('p'), { textContent: 'Tap the bookmark next to a name to keep it here.' }));
    list.replaceChildren(empty);
  }
}

function showCurrent(entry, animate = true) {
  current = entry;
  const output = $('#current-name');
  output.replaceChildren(nameContent(entry));
  output.classList.toggle('long-name', entry.name.length > 21 && entry.name.length <= 30);
  output.classList.toggle('extra-long-name', entry.name.length > 30);
  output.classList.remove('refreshing');
  if (animate) { void output.offsetWidth; output.classList.add('refreshing'); }
  $('#character-count').textContent = `${entry.name.length} characters`;
  $('#name-subtitle').textContent = LEVELS[entry.level].subtitle;
  $('#generator-panel').dataset.level = entry.level;
  resetCopyButton();
  updateSaveButtons();
}

function generate(count = 1, announce = false) {
  try {
    const batch = Array.from({ length: count }, () => engine.generate(level, { alliteration }));
    history.unshift(...batch.slice().reverse());
    history.splice(48);
    showCurrent(batch.at(-1));
    renderHistory();
    if (announce) notify(`${count} fresh possibilities added.`);
  } catch (error) { notify(error.message); }
}

function setLevel(value) {
  level = Number(value);
  const config = LEVELS[level];
  $('#obscurity').value = level;
  $('#obscurity').style.setProperty('--fill', `${level * 50}%`);
  $('#obscurity').setAttribute('aria-valuetext', `${config.name}: ${config.description}`);
  $('#level-index').textContent = `0${level + 1}—03`;
  $('#level-description').textContent = config.description;
  updateCombinations();
  const recipe = [];
  config.recipe.forEach((word, index) => {
    if (index) recipe.push(Object.assign(document.createElement('b'), { textContent: '+' }));
    recipe.push(Object.assign(document.createElement('span'), { textContent: word }));
  });
  $('#recipe').replaceChildren(...recipe);
  document.querySelectorAll('[data-level]').forEach((button) => {
    if (!button.matches('button')) return;
    const active = Number(button.dataset.level) === level;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active);
  });
  generate();
}

function updateCombinations() {
  const count = countCombinations(level, { alliteration });
  $('#combination-count').textContent = formatCombinations(count);
  $('#combination-count').title = `${count.toLocaleString('en-US')} word recipes`;
  $('#combination-note').textContent = alliteration ? 'Same first letter. A little extra rhythm.' : LEVELS[level].note;
}

function exportNames(entries, kind) {
  if (!entries.length) return;
  const blob = new Blob([entries.map((entry) => entry.name).join('\n') + '\n'], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: `oddly-${kind}.txt` });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('Your names, ready to take with you.');
}

$('#generate').addEventListener('click', () => generate());
$('#generate-batch').addEventListener('click', () => generate(12, true));
$('#copy-current').addEventListener('click', (event) => { if (current) copyName(current.name, event.currentTarget); });
$('#save-current').addEventListener('click', () => { if (current) toggleSaved(current); });
$('#obscurity').addEventListener('input', (event) => setLevel(event.target.value));
// Reset on every page load, including browsers that restore form control values.
$('#alliteration').checked = false;
$('#alliteration').addEventListener('change', (event) => {
  alliteration = event.target.checked;
  updateCombinations();
  generate();
});
document.querySelectorAll('button[data-level]').forEach((button) => button.addEventListener('click', () => setLevel(button.dataset.level)));
$('#export-recent').addEventListener('click', () => exportNames(history, 'recent'));
$('#export-saved').addEventListener('click', () => exportNames(saved, 'saved'));
$('#saved-open').addEventListener('click', () => { renderSaved(); $('#saved-dialog').showModal(); });
for (const id of ['about-open', 'about-footer']) $(`#${id}`).addEventListener('click', () => $('#about-dialog').showModal());
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => $(`#${button.dataset.close}`).close()));
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}));

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing || $('dialog[open]')) return;
  if (event.target.closest('input, textarea, select, button, a, [contenteditable]')) return;
  if (event.code === 'Space') { event.preventDefault(); generate(); }
  if (event.key.toLowerCase() === 'c' && current && !window.getSelection()?.toString()) { event.preventDefault(); copyName(current.name, $('#copy-current')); }
});

window.addEventListener('storage', (event) => {
  if (event.key === SAVED_KEY || event.key === null) {
    saved = loadSaved(browserStorage);
    updateSaveButtons();
    renderSaved();
  }
});

setLevel(0);
// A small real history makes the alternatives useful immediately, with no canned results.
if (current) {
  const first = current;
  generate(5);
  showCurrent(first, false);
}
renderSaved();
updateSaveButtons();
