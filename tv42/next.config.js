/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', // leave empty for default
      },
      {
        protocol: 'https',
        hostname: 'api.tv42.com.tr',
        port: '', // leave empty for default
      },
    ],
  },
};

module.exports = nextConfig;