import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 standalone 输出模式，优化 Docker 部署
  output: 'standalone',
  
  /* config options here */
};

export default nextConfig;
