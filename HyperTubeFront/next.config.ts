import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yts.mx'
      }, {
        protocol: 'https',
        hostname: 'api.themoviedb.org'
      }, {
        protocol: 'https',
        hostname: 'image.tmdb.org'
      }, {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      }, {
        protocol: 'https',
        hostname: 'fakeimg.pl'
      }, {
        protocol: 'https',
        hostname: "via.placeholder.com"
      }, {
        protocol: 'https',
        hostname: "hypertube.nyc3.digitaloceanspaces.com"
      }
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
