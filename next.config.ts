import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Disable minification completely to avoid the WebpackError constructor issue
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;
