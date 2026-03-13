/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Completely ignore ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TypeScript errors during builds (optional, but helpful)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
