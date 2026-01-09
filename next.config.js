/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Turbopack to treat this directory as the workspace root. Without this,
  // Next will pick the parent repo because it also has a lockfile, which breaks
  // path aliases like "@/components/...".
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
