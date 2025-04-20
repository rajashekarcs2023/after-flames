/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(geojson|json)$/,
      use: ["json-loader"],
      type: "javascript/auto",
    })
    return config
  },
}

export default nextConfig
