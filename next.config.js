/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !! Remove this in the future
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
};
module.exports = nextConfig;