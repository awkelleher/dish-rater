const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Turbopack what the workspace root is (so @/ aliases resolve correctly
  // in a git worktree where a parent folder also has a lockfile).
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;

