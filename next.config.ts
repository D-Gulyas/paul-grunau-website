import type { NextConfig } from "next";

// Unterpfad für GitHub-Pages-Deployment (leer beim normalen Root-Deployment auf grunau.mobi).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
