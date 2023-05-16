/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    PORT: process.env.PORT || 3000,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    PORT: process.env.PORT || 3000,
  },
  experimental: {
    appDir: true,
  },
  env: {
    API_PORT: process.env.API_PORT,
  }
}

module.exports = nextConfig
