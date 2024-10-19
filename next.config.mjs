/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID
    }
};

export default nextConfig;
