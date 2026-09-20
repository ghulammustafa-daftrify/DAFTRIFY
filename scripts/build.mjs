import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'index.html'), 'utf8');
const markup = source
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

assert.match(source, /^<!DOCTYPE html>/i, 'The document needs a DOCTYPE.');
assert.equal((markup.match(/<main\b/g) || []).length, 1, 'Use one main landmark.');
assert.equal((markup.match(/<h1\b/g) || []).length, 1, 'Use one primary heading.');

const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const known = new Set(ids);
assert.equal(known.size, ids.length, 'Duplicate element IDs found.');

for (const match of markup.matchAll(/\bhref="#([^"]+)"/g)) {
  assert(known.has(match[1]), `Missing anchor or SVG target: ${match[1]}`);
}
for (const match of markup.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) {
    assert(known.has(id), `Missing accessibility reference: ${id}`);
  }
}

const sections = [...markup.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(sections, ['hero', 'condition', 'casework', 'capabilities', 'proof', 'principles', 'where', 'pricing', 'about', 'intake']);
assert.equal((markup.match(/data-paper="\d"/g) || []).length, 7, 'The dossier must have seven source sheets.');
assert.equal((markup.match(/data-phase="\d"/g) || []).length, 7, 'The dossier must have seven navigation stages.');
assert.equal((markup.match(/role="tabpanel"/g) || []).length, 3, 'There must be three operable demonstrations.');

const videoSources = [...markup.matchAll(/<video\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(videoSources, ['https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/templates/orchid/hero.mp4']);
assert.match(source, /https:\/\/cdn\.jsdelivr\.net\/npm\/@tailwindcss\/browser@4/);
assert.match(source, /motion@12\.38\.0/);
assert.doesNotMatch(source, /once\s*:\s*true/, 'Page motion must not be a one-time reveal.');
assert.doesNotMatch(markup, /10,000|guaranteed turnaround|trusted by/i, 'Unsupported business claim found.');

const publicText = markup.replace(/<[^>]*>/g, ' ');
assert.doesNotMatch(publicText, /\bAI\b/i, 'Prohibited public wording found.');
assert.match(publicText, /Ghulam Mustafa/);
assert.match(publicText, /daftrify\.services@gmail\.com/);
assert.match(publicText, /Simulated demonstration/i);

let scriptsChecked = 0;
for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || !match[2].trim()) continue;
  new Script(match[2], { filename: `index.inline-${++scriptsChecked}.js` });
}

console.log(`Source checks passed: ${sections.length} sections, ${ids.length} unique IDs, ${scriptsChecked} inline script.`);
console.log('These checks do not replace browser, media-playback, accessibility or hardware testing.');

if (!process.argv.includes('--check')) {
  await mkdir(resolve(root, 'dist'), { recursive: true });
  await writeFile(resolve(root, 'dist/index.html'), source);
  console.log('Static production artifact written to dist/index.html. External media and CDNs still require network access.');
}