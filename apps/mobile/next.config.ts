import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  register: true,
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  cacheStartUrl: false,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    navigateFallbackDenylist: [/^\/auth/],
  },
  publicExcludes: ["!manifest.json", "!*.woff2", "!iconss/**"],
});

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@slowpace/ui", "lucide-react"],
  reactCompiler: true,
  turbopack: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self'; 
              script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
              connect-src 'self' ${isDev ? "http://localhost:3000 ws://localhost:3000 http://localhost:3333" : ""} https://slowpace.duckdns.org; 
              img-src 'self' data: blob: https://images.unsplash.com; 
              style-src 'self' 'unsafe-inline'; 
              object-src 'none'; 
              manifest-src 'self';
            `.replace(/\s{2,}/g, " ").trim()
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ]
      }
    ];
  }
};

export default withPWA(nextConfig) as NextConfig;