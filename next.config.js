/**
 * @type {import('next').NextConfig}
 */
const isProd = process.env.NODE_ENV === 'production';
const isExport = process.env.EXPORT === 'true'; // Use EXPORT=true npm run build for static export

const nextConfig = {
  output: isExport ? 'export' : undefined, // Static export only when EXPORT=true
  distDir: isExport ? 'dist' : '.next',
  images: {
    unoptimized: true,
  },
  assetPrefix: isExport ? 'https://miido.ai/' : '',

  // Configuración de Webpack
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
