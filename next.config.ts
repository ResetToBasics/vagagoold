import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET;
const normalizeTarget = (target?: string) => {
  if (!target) return undefined;
  return target.endsWith("/") ? target.slice(0, -1) : target;
};

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const destino = normalizeTarget(apiProxyTarget);
    if (!destino) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${destino}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
