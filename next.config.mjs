/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Exportar como sitio estático
  images: {
    unoptimized: true, // Evita optimizaciones de imágenes en tiempo de construcción
  },
  basePath: '/web', // Reemplaza <REPO_NAME> con el nombre de tu repositorio
};

export default nextConfig;