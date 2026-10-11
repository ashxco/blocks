import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The sidebar's Theme and Appearance controls sit bottom-left.
  devIndicators: { position: "bottom-right" },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Browsers and crawlers still ask for /favicon.ico; the icon is app/icon.svg.
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
    ]
  },
}

export default nextConfig
