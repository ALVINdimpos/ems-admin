import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Required for Docker standalone build
  output: "standalone",
};

export default nextConfig;
