import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Browsers and crawlers still ask for /favicon.ico; the icon is app/icon.svg.
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
    ]
  },
}

export default nextConfig
