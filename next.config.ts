import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    // Hostinger's Node.js app builder wraps the app in a `standalone` server
    // whose outputFileTracingRoot doesn't match the deployed directory, which
    // breaks next/image's internal self-fetch for local (/uploads/...) images
    // (returns "The requested resource isn't a valid image"). Images are
    // already served fast via Hostinger's CDN, so skip optimization instead.
    unoptimized: true,
  },
};

export default nextConfig;
