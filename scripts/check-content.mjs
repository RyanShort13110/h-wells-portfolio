import fs from 'node:fs';

// Match the rules in .pages.yml: CMS-optional fields may be cleared safely.
// Genuinely required content, malformed links and missing referenced files fail
// validation rather than publishing a broken production page.
const read = (name) => JSON.parse(fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'));
const site = read('site');
const samples = read('samples');
const skills = read('skills');
const results = read('results');
const sections = read('sections');
const experience = read('experience');
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const warn = (message) => console.warn(`⚠ ${message}`);
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;

for (const field of ['name', 'role', 'headlineFirst', 'introduction', 'email', 'seoTitle', 'seoDescription']) {
  if (!nonempty(site[field])) fail(`Missing required site.${field}`);
}
if (site.linkedin != null && site.linkedin !== '' && typeof site.linkedin !== 'string') {
  fail('site.linkedin must be a URL string when provided');
}
if (site.headlineAccent != null && typeof site.headlineAccent !== 'string') {
  fail('site.headlineAccent must be text when provided');
}
for (const [field, directory, extension] of [
  ['resumeFile', 'documents', 'pdf'],
  ['headshot', 'images', '(?:png|jpe?g|webp|svg)']
]) {
  const value = site[field];
  if (value == null || value === '') continue; // Removing optional media is safe.
  const re = new RegExp(`^/${directory}/[a-zA-Z0-9_\\-./%]+\\.${extension}$`, 'i');
  if (typeof value !== 'string' || !re.test(value) || value.includes('..')) {
    fail(`site.${field} must point to a local /${directory}/ file`);
    continue;
  }
  let localFile;
  try { localFile = new URL(`../public${decodeURIComponent(value)}`, import.meta.url); }
  catch { fail(`Invalid site.${field} path: ${value}`); continue; }
  if (!fs.existsSync(localFile)) fail(`Referenced file not found: ${value}`);
}
if (!Array.isArray(samples)) fail('Writing samples must be a list');
else {
  if (!samples.length) warn('No writing samples; the site will show a friendly empty state.');
  samples.forEach((sample, index) => {
    for (const field of ['title', 'client', 'url']) {
      if (!nonempty(sample?.[field])) fail(`Writing sample #${index+1} requires ${field}`);
    }
    if (nonempty(sample?.url)) {
      try {
        const url = new URL(sample.url);
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid protocol');
      } catch { fail(`Invalid article URL for sample #${index+1}`); }
    }
    for (const field of ['spotlightArtLabel','spotlightArtTitle']) {
      if (sample?.[field] != null && typeof sample[field] !== 'string') fail(`Sample #${index+1} ${field} must be text`);
    }
  });
  if (samples.filter(x => x?.spotlight).length > 1) warn('Multiple spotlights; the first is shown.');
}
if (!Array.isArray(skills)) fail('Skills must be a list');
else skills.forEach((group,index) => {
  if (!nonempty(group?.heading)) fail(`Skill group #${index+1} needs a name`);
  if (group?.items != null && !Array.isArray(group.items)) fail(`Skill group #${index+1} skills must be a list`);
});
if (!Array.isArray(results)) fail('SEO results must be a list');
else results.forEach((result,index) => {
  if (!nonempty(result?.project) || !nonempty(result?.metric)) fail(`SEO result #${index+1} needs a project and metric`);
});
if (!Array.isArray(experience)) fail('Professional experience must be a list');
else experience.forEach((job,index) => {
  for(const field of ['company','title','body']) {
    if (!nonempty(job?.[field])) fail(`Experience #${index+1} needs ${field}`);
  }
});
if (!sections || typeof sections !== 'object' || Array.isArray(sections)) fail('Section text must be an object');
else for (const [field,value] of Object.entries(sections)) {
  if (value != null && typeof value !== 'string') fail(`Section text ${field} must be text`);
}
if (!process.exitCode) console.log(`✓ Valid content: ${samples.length} articles, ${skills.length} skill groups, ${results.length} result cards, ${experience.length} experience entries`);
