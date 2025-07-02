/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      // Shopify 產品圖真正的 CDN
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      // （可選）若日後仍想載商店網域下的圖片
      {
        protocol: 'https',
        hostname: process.env.SHOPIFY_STORE_DOMAIN,
        pathname: '/**',
      },
    ],
    // ➜ 如你只想快速測試，也可以用最簡單寫法：
    // domains: ['cdn.shopify.com'],
  },
};