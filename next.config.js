/**
 * @type {import('next').NextConfig}
 */
const isExport = process.env.EXPORT === 'true';

const nextConfig = {
  output: isExport ? 'export' : 'standalone',
  distDir: isExport ? 'dist' : '.next',
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },

};

module.exports = nextConfig;
