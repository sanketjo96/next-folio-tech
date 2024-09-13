/** @type {import('next').NextConfig} */


const nextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "nl"]
  },
  images: {
    domains: ['images.unsplash.com', 'fakeimg.pl']
  }
};

export default nextConfig;
