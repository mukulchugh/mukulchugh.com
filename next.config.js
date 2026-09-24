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
    // Let Next own HTML/RSC and development caching. A blanket public cache
    // can pair fresh server markup with an outdated client bundle.
    if (process.env.NODE_ENV !== "production") return [];
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
  outputFileTracingIncludes: {
    "/og/*": [
      "./public/fonts/og/*",
      "./public/design/brand/*",
      "./public/design/articles/*-reference.png",
      "./public/design/project-art-v3/*",
      "./public/design/projects/*",
    ],
  },
  poweredByHeader: false,
  reactCompiler: true,

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
  async rewrites() {
    return {
      beforeFiles: [
        { destination: "/markdown", source: "/index.md" },
        { destination: "/markdown", source: "/.md" },
        { destination: "/markdown/:path+", source: "/:path+.md" },
      ],
    };
  },
  // Streamdown's code-highlighting plugin pulls in shiki, which ships ESM
  // that Next's default external-package handling can't resolve in RSC.
  transpilePackages: ["shiki"],
};

module.exports = nextConfig;
