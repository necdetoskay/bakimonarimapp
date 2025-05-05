// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Disable static export completely
  output: 'standalone',
  
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  
  // Disable static optimization for all pages
  staticPageGenerationTimeout: 180,
  
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  
  // Add custom webpack configuration
  webpack: (config, { isServer }) => {
    return config;
  },
}

export default nextConfig
