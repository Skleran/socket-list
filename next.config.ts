import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"], // 👈 add your domain(s) here
  },
};

export default nextConfig;
