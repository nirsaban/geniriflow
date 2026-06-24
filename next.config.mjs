/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle in .next/standalone for a small Docker image.
  output: "standalone",
};

export default nextConfig;
