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
// force redeploy with env vars Sat Mar 14 02:07:41 AM EAT 2026
