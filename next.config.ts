import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      // Legacy URLs still present in Google sitelinks and external links.
      { source: "/pro-kompaniyu", destination: "/about", permanent: true },
      { source: "/poslugi", destination: "/expertise", permanent: true },
      { source: "/kliyenti", destination: "/about", permanent: true },
      { source: "/webinars", destination: "/expertise/qualification", permanent: true },
      { source: "/news", destination: "/insights", permanent: true },
      { source: "/kontakti", destination: "/contacts", permanent: true },
      { source: "/qualification-center", destination: "/expertise/qualification", permanent: true },
    ];
  },
};

export default nextConfig;
