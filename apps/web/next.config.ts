import type { NextConfig } from "next";

/**
 * Next.js configuration for the CodeReview.ai web application.
 *
 * @remarks
 * - Transpiles internal monorepo packages for proper bundling
 * - Enables React strict mode for development best practices
 * - Configures remote image patterns for external assets
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  transpilePackages: [
    "@codereview-ai/ui",
    "@codereview-ai/types",
    "@codereview-ai/utils",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
  },

  /** Webpack configuration for monorepo compatibility */
  webpack: (config) => {
    // Ensure proper resolution of monorepo packages
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
