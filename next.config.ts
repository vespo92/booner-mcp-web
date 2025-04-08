import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Removed swcMinify as it's now the default in Next.js 15
  experimental: {
    // Updated to use the new location for external packages
    serverExternalPackages: ['@prisma/client']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_OLLAMA_API_URL: process.env.NEXT_PUBLIC_OLLAMA_API_URL,
  },
};

export default nextConfig;
