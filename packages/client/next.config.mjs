/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST: process.env.HOST,
    PORT: process.env.API_PORT,
  },
  reactStrictMode: true,
};

export default nextConfig;
