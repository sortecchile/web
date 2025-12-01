/**
 * @type {import('next').NextConfig}
 */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined, // Solo 'export' en producción
  distDir: isProd ? 'dist' : '.next', // Usar 'dist' en producción y '.next' en desarrollo
  images: {
    unoptimized: true, // Mantén esto igual para ambos entornos
  },
  assetPrefix: isProd ? 'https://www.miido.ai/' : '', // Usar el prefijo solo en producción

  // Configuración de Webpack
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // Ignorar el módulo 'canvas'
    };
    return config;
  },
};

module.exports = nextConfig;
