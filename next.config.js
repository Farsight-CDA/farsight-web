module.exports = {
  reactStrictMode: true,
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://192.168.0.175:8081/api/:path*',
        },
      ]
    },
};
