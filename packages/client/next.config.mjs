/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HOST: process.env.HOST,
        PORT: process.env.API_PORT,
        ENOKI_API_KEY: process.env.ENOKI_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      },
      reactStrictMode: true,
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
