import path from "path"

const __dirname = path.resolve()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include only JavaScript and TypeScript files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
