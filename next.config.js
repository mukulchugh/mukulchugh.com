/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  compress: true,

  // Tree-shake heavy icon / UI packages across the client graph
  experimental: {
    optimizePackageImports: [
      "@base-ui/react",
      "@tabler/icons-react",
      "motion",
      "clsx",
      "class-variance-authority",
    ],
  },

  async headers() {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|woff|woff2|ttf|otf)",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
        source: "/blog/:slug*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
        source: "/:path*",
      },
    ];
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ["image/avif", "image/webp"],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
      {
        hostname: "cdn.hashnode.com",
        protocol: "https",
      },
      {
        hostname: "hashnode.com",
        protocol: "https",
      },
    ],
  },
  poweredByHeader: false,

  async redirects() {
    return [
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/hello-world",
      },
      // Removed during blog rewrite (short 10-post set)
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/memory-consolidation-without-losing-provenance",
      },
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/hermes-memory-is-a-product-boundary",
      },
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/artifacts-make-agent-code-review-legible",
      },
      // Trimmed for depth — no concrete engineering decision, just mindset/meta commentary.
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/talking-about-private-work",
      },
      {
        destination: "/blog",
        permanent: true,
        source: "/blog/engineer-turned-generalist",
      },
    ];
  },
};

module.exports = nextConfig;
