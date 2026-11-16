/**
 * CMS regression tests: run without Astro or third-party test dependencies.
 * Ensures deleting optional content works, while invalid required content
 * and broken media links still stop a production deployment.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'helen-cms-test-'));
const names = ['site', 'sections', 'samples', 'skills', 'results', 'experience'];
const original = Object.fromEntries(names.map((name) => [
  name, JSON.parse(fs.readFileSync(path.join(root, 'src/data', name + '.json'), 'utf8'))
]));
const clone = (value) => structuredClone(value);
fs.mkdirSync(path.join(temp, 'scripts'), { recursive: true });
fs.mkdirSync(path.join(temp, 'src/data'), { recursive: true });
fs.mkdirSync(path.join(temp, 'public/documents'), { recursive: true });
fs.mkdirSync(path.join(temp, 'public/images'), { recursive: true });
fs.copyFileSync(path.join(root, 'scripts/check-content.mjs'), path.join(temp, 'scripts/check-content.mjs'));

for (const field of ['resumeFile', 'headshot']) {
  const name = original.site[field];
  if (typeof name === 'string' && name.startsWith('/') && !name.includes('..')) {
    const file = path.join(temp, 'public', decodeURIComponent(name));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'fixture');
  }
}

let failed = 0;
function check(description, change, expectedSuccess) {
  const data = clone(original);
  change(data);
  for (const name of names) fs.writeFileSync(path.join(temp, 'src/data', name + '.json'), JSON.stringify(data[name]));
  const run = spawnSync(process.execPath, [path.join(temp, 'scripts/check-content.mjs')], { encoding: 'utf8' });
  const success = run.status === 0;
  if (success !== expectedSuccess) {
    failed++;
    console.error('FAIL:', description, '\n', run.stdout, run.stderr);
  } else console.log('PASS:', description);
}

try {
  check('Original project content passes', () => {}, true);
  check('CMS optional text, links, media and collections can all be cleared', (d) => {
    for (const key of ['headlineAccent', 'eyebrow', 'aboutHeading', 'aboutBody', 'aboutNote', 'education', 'experienceHeading', 'linkedin', 'resumeFile', 'headshot']) delete d.site[key];
    d.sections = {};
    d.skills = [];
    d.samples = [];
    d.results = [];
    d.experience = [];
  }, true);
  check('A skill group with an empty skills list is valid', (d) => {
    d.skills = [{ heading: 'Writing', items: [] }];
  }, true);
  check('Missing required primary headline fails', (d) => {
    delete d.site.headlineFirst;
  }, false);
  check('Invalid article URL fails', (d) => {
    d.samples = [{ title: 'Sample', client: 'Client', url: 'javascript:alert(1)' }];
  }, false);
  check('Incomplete writing sample fails', (d) => {
    d.samples = [{ title: 'Sample', client: 'Client' }];
  }, false);
  check('Broken document references fail', (d) => {
    d.site.resumeFile = '/documents/missing.pdf';
  }, false);
  check('Incomplete experience entry fails', (d) => {
    d.experience = [{ company: 'Example', title: 'Writer' }];
  }, false);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
if (failed) process.exitCode = 1;
else console.log('CMS regression checks passed.');
