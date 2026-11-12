/** @type {import('next').NextConfig} */


const nextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "nl"]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'fakeimg.pl' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  poweredByHeader: false,
  // Short links per channel (no "?" so any bio field accepts them). The UTM
  // tags let analytics tell visitors from each channel apart.
  async redirects() {
    const go = (source, path, utmSource, utmMedium) => ({
      source,
      destination: `${path}?utm_source=${utmSource}&utm_medium=${utmMedium}`,
      permanent: false,
    });
    return [
      go('/ig', '/artist', 'instagram', 'bio'),
      go('/fb', '/artist', 'facebook', 'profile'),
      go('/bms', '/artist', 'bookmyshow', 'profile'),
      go('/li', '/', 'linkedin', 'profile'),
      go('/gh', '/', 'github', 'profile'),
      go('/cv', '/', 'resume', 'pdf'),
    ];
  },
  // /api/llms reads the markdown in content/ at request time.
  outputFileTracingIncludes: {
    '/api/llms': ['./content/**/*'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
