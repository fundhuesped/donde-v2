/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // SVG loader
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use:
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false
                }
              ]
            },
            titleProp: true,
          },
        },

    });
    return config;
  },
}

module.exports = nextConfig
