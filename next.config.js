/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  headers: async () => {
    return [
      {
        // Static assets (images, fonts, etc.)
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      {
        // Next.js build assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Blog posts (ISR compatible)
        source: "/blog/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400", // 1 hour, revalidate in background for 1 day
          },
        ],
      },
      {
        // Homepage and other pages
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800", // 1 day, revalidate in background for 1 week
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"], // Modern image formats (AVIF first for best compression)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Small image sizes
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
      {
        protocol: "https",
        hostname: "hashnode.com",
      },
    ],
  },
};

module.exports = nextConfig;
