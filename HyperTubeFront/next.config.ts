import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ hostname: '**' }],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
