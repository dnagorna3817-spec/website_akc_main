import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      // Legacy service URLs -> current service pages.
      { source: "/qualification-center", destination: "/expertise/qualification", permanent: true },
      { source: "/poslugi", destination: "/expertise", permanent: true },
      { source: "/service/audyt", destination: "/expertise/audit", permanent: true },
      { source: "/service/konsaltyng", destination: "/expertise/consulting", permanent: true },
      { source: "/service/it-suprovid", destination: "/expertise/digital", permanent: true },
    ];
  },
};

export default nextConfig;
