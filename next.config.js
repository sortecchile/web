/**
 * @type {import('next').NextConfig}
 */
const isExport = process.env.EXPORT === 'true';
const isContractorsDeploy = process.env.DEPLOY_TARGET === 'contractors';

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

  async rewrites() {
    if (!isContractorsDeploy) return [];
    return [
      { source: '/', destination: '/contractors/index.html' },
    ];
  },
};

module.exports = nextConfig;
