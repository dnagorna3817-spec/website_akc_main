
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      { source: "/qualification-center", destination: "/expertise/qualification", permanent: true },
    ];
  },
};

export default nextConfig;
