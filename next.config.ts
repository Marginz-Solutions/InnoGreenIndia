import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'top-right'
  },
  logging: {
    incomingRequests: true,
    serverFunctions: true,
    browserToTerminal: 'error'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fogpzfolwgyormnelsqp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
