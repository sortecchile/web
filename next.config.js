/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  assetPrefix: 'https://www.miido.cl/', // Asegúrate de usar tu dominio personalizado
}

module.exports = nextConfig;