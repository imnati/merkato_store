/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "merkatostore.com",
      },
    ],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
