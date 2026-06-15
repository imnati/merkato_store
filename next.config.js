/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns በአዲሱ Next.js የ domains ምትክ የመጣ ይበልጥ አስተማማኝ አሰራር ነው
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ከ Unsplash ላይ የምርት ምስሎችን ለማምጣት
      },
      {
        protocol: "https",
        hostname: "merkatostore.com", // ለራስህ ድረ-ገጽ ምስሎች
      },
    ],
    minimumCacheTTL: 31536000, // ምስሎችን ለ1 ዓመት በሰርቨር ላይ ያስቀምጣል (ፈጣን እንዲሆን)
  },
};

module.exports = nextConfig;
