import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Configure the site URL in astro.config.mjs');

  const robots = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${new URL('/sitemap.xml', site).toString()}`,
    ''
  ].join('\n');

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
