/**
 * Sitemap + robots.txt, generated after `next build` (see "postbuild").
 * Content is English, so only the default-locale URLs are listed; the
 * /fr and /nl copies point their canonical at the English page.
 * @type {import('next-sitemap').IConfig}
 */
const PRIVATE = ['/login', '/dashboard', '/api/*'];

// AI crawlers and agents, allowed explicitly so the intent is unambiguous.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'CCBot',
  'DuckAssistBot',
  'cohere-ai',
  'MistralAI-User',
];

module.exports = {
  siteUrl: 'https://www.techsanket.in',
  generateRobotsTxt: true,
  exclude: [...PRIVATE, '/fr', '/fr/*', '/nl', '/nl/*'],
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === '/' || path === '/artist' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0 : path === '/artist' ? 0.9 : 0.7,
    lastmod: new Date().toISOString(),
  }),
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/login', '/dashboard'] },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/', '/login', '/dashboard'] })),
    ],
  },
};
