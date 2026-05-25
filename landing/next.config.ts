import type { NextConfig } from "next";

const repo = "2026-capstone-09";
const isVercel = process.env.LANDING_ENV === "vercel";
const basePath = isVercel ? "" : `/${repo}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: isVercel ? "" : `/${repo}/`,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
