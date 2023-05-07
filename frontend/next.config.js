/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
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
}

module.exports = nextConfig
