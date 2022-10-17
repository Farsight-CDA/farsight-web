module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://testnet-farsight.playwo.de/api/:path*",
      },
    ];
  },
};
