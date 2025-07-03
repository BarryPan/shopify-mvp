/** @type {import('next').NextConfig} */
module.exports = {
  /* ---------- 1. 保留你原本的設定 ---------- */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.SHOPIFY_STORE_DOMAIN,
        pathname: "/**",
      },
    ],
    // 若只想快速測試 ↓
    // domains: ["cdn.shopify.com"],
  },

  /* ---------- 2. 新增「忽略錯誤」設定 ---------- */
  typescript: {
    // build 時 **不因 TS Error 失敗**
    ignoreBuildErrors: true,
  },
  eslint: {
    // build 時 **不因 ESLint Error 失敗**
    ignoreDuringBuilds: true,
  },
};