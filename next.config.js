/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
};

module.exports = nextConfig;