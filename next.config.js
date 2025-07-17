/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'media.licdn.com'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  env: {
    CUSTOM_KEY: 'hapiick-demo',
  },
  // Configuración mejorada para desarrollo
  experimental: {
    // Turbopack se activa automáticamente con --turbo flag
  },
  // Optimización para hot reload
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Mejorar velocidad del hot reload
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
}

module.exports = nextConfig 