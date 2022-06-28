const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    target: ['web'],
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        fs: false
      }
    },
  }
})
