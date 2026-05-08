import type { NextConfig } from 'next';

const repo = '2026-capstone-09';
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? `/${repo}` : '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: isProd ? `/${repo}/` : '',
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
