/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HOST: process.env.HOST,
        PORT: process.env.API_PORT,
        ENOKI_API_KEY: process.env.ENOKI_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      },
      reactStrictMode: true,
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
