import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"], // 👈 add your domain(s) here
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
