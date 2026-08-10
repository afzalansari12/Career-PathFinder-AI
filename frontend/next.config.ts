// frontend/next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Only pull in the specific icon components actually used on each page,
  // instead of Turbopack having to resolve/compile the whole lucide-react
  // module graph on first visit to every route.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Pins Turbopack's root to this frontend/ folder — fixes the
  // "ignored package-lock.json ... outside the current Git repository"
  // warning, which otherwise makes Turbopack search a wider directory
  // tree than necessary on every route compile.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;