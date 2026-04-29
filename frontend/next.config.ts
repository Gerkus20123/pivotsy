import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
