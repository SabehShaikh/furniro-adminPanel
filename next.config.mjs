import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  env: {
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  },
};

export default nextConfig;