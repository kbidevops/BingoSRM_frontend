import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // React Strict Mode 비활성화 -> 준명 : 나중에 버그 잡기가 어려워지니까 버그잡을때는 true로 해서 잡을것!
  output: "export", // 모든 페이지를 정적 HTML로 export
  trailingSlash: false, // URL 끝에 슬래시 제거
  images: {
    unoptimized: true, // Image Optimization API 사용 안함
  },
};

export default nextConfig;
