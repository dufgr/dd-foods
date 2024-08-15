/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    qualities: [75, 100],
    remotePatterns: [{ hostname: "utfs.io" }],
  },
};

export default nextConfig;
