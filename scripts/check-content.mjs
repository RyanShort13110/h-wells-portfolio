import fs from 'node:fs';

const read = (name) => JSON.parse(fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'));
const site = read('site');
const samples = read('samples');
const skills = read('skills');
const results = read('results');
const sections = read('sections');
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
for (const field of ['name','role','headlineFirst','headlineAccent','introduction','email','linkedin']) {
  if (!site[field]) fail(`Missing site.${field}`);
}
if (site.resumeFile) {
  const path = site.resumeFile;
  if (typeof path !== 'string' || !/^\/documents\/[a-zA-Z0-9_\-./%]+\.pdf$/i.test(path) || path.includes('..')) {
    fail('site.resumeFile must be a local /documents/*.pdf path selected using Pages CMS');
  } else {
    const file = new URL(`../public${decodeURIComponent(path)}`, import.meta.url);
    if (!fs.existsSync(file)) fail(`Résumé PDF not found: ${path}`);
  }
}
if (!Array.isArray(samples) || !samples.length) fail('No writing samples');
else {
  for (const [index,sample] of samples.entries()) {
    if (!sample.title || !sample.client || !sample.url) fail(`Sample #${index+1} needs title, client, URL`);
    try { if (!['https:', 'http:'].includes(new URL(sample.url).protocol)) throw new Error(); }
    catch { fail(`Invalid URL for sample #${index+1}`); }
  }
  const spotlights = samples.filter((sample) => sample.spotlight);
  if (spotlights.length > 1) console.warn(`⚠ ${spotlights.length} spotlight articles selected. The first in the CMS list will be displayed. Uncheck the others when convenient.`);
  if (spotlights.length === 0) console.warn('⚠ No spotlight article selected. The first featured article (or first writing sample) will be displayed.');
  for (const [index, sample] of samples.entries()) {
    for (const field of ['spotlightArtLabel','spotlightArtTitle']) {
      if (sample[field] != null && typeof sample[field] !== 'string') fail(`Sample #${index+1} ${field} must be plain text`);
    }
  }
}
if (!Array.isArray(skills)) fail('Skills must be an array');
if (!Array.isArray(results)) fail('Results must be an array');
for (const field of ['resultsIntro','resultsDisclaimer']) {
  if (typeof sections[field] !== 'string') fail(`Section text ${field} must be a string`);
}
if (!process.exitCode) console.log(`✓ Valid content: ${samples.length} articles, ${skills.length} skill groups, ${results.length} result cards`);
