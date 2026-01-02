// Bundle analyzer for monitoring bundle size
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  // ============================================
  // CHUNK & BUNDLE OPTIMIZATION
  // ============================================

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-avatar",
      "@radix-ui/react-slot",
      "motion",
      "clsx",
      "class-variance-authority",
    ],
  },

  // Modularize imports for icon libraries (critical for bundle size)
  modularizeImports: {
    "react-icons/?(((\\w*)?/?)*)": {
      transform: "react-icons/{{ matches.[1] }}/{{ member }}",
      skipDefaultConversion: true,
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize chunks
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000, // Keep chunks under 244KB for better caching
          cacheGroups: {
            // Separate Three.js into its own chunk (loaded only when needed)
            three: {
              test: /[\\/]node_modules[\\/](three)[\\/]/,
              name: "three",
              chunks: "async",
              priority: 30,
              reuseExistingChunk: true,
            },
            // Separate motion/framer-motion
            motion: {
              test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
              name: "motion",
              chunks: "all",
              priority: 25,
              reuseExistingChunk: true,
            },
            // Separate Radix UI components
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix",
              chunks: "all",
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
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

module.exports = withBundleAnalyzer(nextConfig);
