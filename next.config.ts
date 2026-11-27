import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // src/content/blog の Markdown をサーバー関数に同梱する（fs で読むため）
  outputFileTracingIncludes: {
    "/**": ["./src/content/blog/**/*"],
  },
};

export default nextConfig;
