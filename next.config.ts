import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // No basePath needed — deploying to reztsky.github.io (root domain)
};

export default nextConfig;
