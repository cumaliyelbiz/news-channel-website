import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Tarayıcı tarafında `child_process` gibi server-side modüllerinin yüklenmesini engelliyoruz.
      config.node = {
        ...config.node,
        child_process: 'empty',
      };
    }
    return config;
  },
  images: {
    domains: ['localhost'], // Resimlerin `localhost`'tan gelmesine izin veriyoruz.
  },
  reactStrictMode: false,
};

export default nextConfig;
