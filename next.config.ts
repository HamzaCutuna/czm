import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // for quick debug; tighten later
    ],
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
