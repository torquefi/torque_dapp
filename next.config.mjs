// const path = require('path')
import path from "path"
// const withMDX = require('@next/mdx')()
import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"

const __dirname = path.resolve()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx','md'],
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Optionally, add any other Next.js config below
}
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// export {
//   reactStrictMode: true,
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//   },
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
// }

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.md$/,
//         use: 'raw-loader'
//       }
//     ]
//   }
// }
export default withMDX(nextConfig)
