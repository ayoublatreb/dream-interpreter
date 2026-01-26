/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
  };
  
  module.exports = nextConfig;



  /* @type {import('next').NextConfig}
const nextConfig = {
    reactStrictMode: true,
    // Ensure we can use the API across different ports/domains if needed
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
                    : 'http://localhost:3001/:path*',
            },
        ]
    },
}

module.exports = nextConfig
 */