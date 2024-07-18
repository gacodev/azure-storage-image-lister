/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@azure/storage-blob', '@azure/identity'],
      },
};

export default nextConfig;
