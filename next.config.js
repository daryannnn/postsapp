const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: false,

  webpack(config, { isServer }) {
    config.plugins.push(
        new NextFederationPlugin({
          name: 'posts',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './UserFeed': 'src/components/UserFeed.tsx',
            './UserPosts': 'src/components/UserPosts.tsx',
            './FavoritePostsSurface': 'src/components/FavoritePostsSurface.tsx',
          },
          shared: {},
        })
    );
    config.devServer = {
      client: { overlay: { warnings: false } }
    }

    return config;
  },

  /*webpack: function (config, _) {
      config.devServer = {
          client: { overlay: { warnings: false } }
      }
      return config
  }*/
}

module.exports = nextConfig
