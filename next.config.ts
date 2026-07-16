import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;
const isCloudflarePages = Boolean(
  process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES,
);
const isCloudflareWorkers = Boolean(process.env.CLOUDFLARE_WORKERS);

const nextConfig: NextConfig =
  pagesBasePath || isCloudflarePages || isCloudflareWorkers
  ? {
      output: "export",
      ...(pagesBasePath ? { basePath: pagesBasePath } : {}),
    }
  : {};

export default nextConfig;
