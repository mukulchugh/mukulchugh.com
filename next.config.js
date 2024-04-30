/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  optimizeFonts: true,

  headers: async () => {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=9999999999, must-revalidate", // 1 year
          },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

module.exports = nextConfig;
