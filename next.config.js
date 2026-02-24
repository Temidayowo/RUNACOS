/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fly.storage.tigris.dev',
      },
      {
        protocol: 'https',
        hostname: '*.fly.storage.tigris.dev',
      },
    ],
  },
};

module.exports = nextConfig;
