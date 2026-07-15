import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = pagesBasePath
  ? {
      output: "export",
      basePath: pagesBasePath,
    }
  : {};

export default nextConfig;
