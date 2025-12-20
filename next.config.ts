// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   // reactStrictMode: true,
//   reactStrictMode: false,

// };

// export default nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Rewrite for auth-related APIs
        source: '/api/login', 
        // source: '/api/proxy/:path*',
        destination: 'https://n.our-demos.com/driving-school/login',
      },
    
      {
        // Rewrite for auth-related APIs
         source: '/api/admin/:path*', 
        // source: '/api/proxy/:path*',
        destination: 'https://n.our-demos.com/driving-school/admin/:path*',
      },
      {
        source: '/api/staff/:path*',
        destination: 'https://n.our-demos.com/driving-school/staff/:path*',
      }
    ];
  },
};

export default nextConfig;