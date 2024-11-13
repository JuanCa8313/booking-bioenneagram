import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "d33wubrfki0l68.cloudfront.net",
      },
      {
        protocol: 'https',
        hostname: "ucarecdn.com",
      },
    ],
  },
};

export default nextConfig;
