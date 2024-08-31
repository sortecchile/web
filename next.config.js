/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  assetPrefix: './', // Asegura que los recursos estáticos se carguen correctamente
  basePath: '', // Deja vacío si estás usando el dominio raíz
}

module.exports = nextConfig;