/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'newsapi.org',
      'techcrunch.com',
      'cdn.cnn.com',
      'media.wired.com',
      'static01.nyt.com',
      'i.imgur.com',
    ],
    unoptimized: true,
  },
  env: {
    NEWS_API_KEY: process.env.NEWS_API_KEY,
  },
};

module.exports = nextConfig;
