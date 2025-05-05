/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  // Veritabanı bağlantısı gerektiren sayfalar için statik dışa aktarma devre dışı bırakılıyor
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
