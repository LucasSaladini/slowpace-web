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
    navigateFallbackDenylist: [/^\/auth/, /vercel\.com/],
  },
  publicExcludes: ["!manifest.json", "!*.woff2", "!iconss/**"],
});

const nextConfig: NextConfig = {
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
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.com; 
              connect-src 'self' ${isDev ? "http://localhost:3333 ws://localhost:3333" : ""} https://slowpace-web.onrender.com https://slowpace-web.vercel.app https://*.vercel-analytics.com; 
              img-src 'self' data: blob:; 
              style-src 'self' 'unsafe-inline'; 
              object-src 'none'; 
              manifest-src 'self' https://vercel.com https://*.vercel.app;
            `.replace(/\s{2,}/g, " ").trim()
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ]
      }
    ];
  }
};

export default withPWA(nextConfig) as NextConfig;