const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css", "svg", "eot", "ttf"];
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  parallel: require("os").cpus().length > 1, // 构建时开启多进程处理 babel 编译
  pages: {
    index: {
      entry: "src/main.js",
      template: "index.html",
      filename: "index.html",
      title: "签名插件",
      chunks: ["chunk-vendors", "chunk-common", "index"],
      cdn:
        process.env.NODE_ENV === "production"
          ? {
              js: ["https://cdn.bootcss.com/vue/2.6.11/vue.js"]
            }
          : {}
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    externals:
      process.env.NODE_ENV === "production"
        ? {
            vue: "Vue"
          }
        : {},
    devtool:
      process.env.NODE_ENV === "production" ? false : "inline-source-map",
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        src: "@"
      }
    },
    plugins: [
      // 压缩插件
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack: config => {
    config.module.rule("eslint").exclude.end();
    // 移除 prefetch 插件
    config.plugins.delete("prefetch-index").delete("preload-index");
  },
  css: {
    requireModuleExtension: true,
    extract: process.env.NODE_ENV === "production" ? true : false,
    sourceMap: process.env.NODE_ENV === "production" ? false : true,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: "[local]_[hash:base64:8]"
        }
      }
    }
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 8866,
    https: false,
    hot: true,
    hotOnly: true,
    compress: true
  },
  // 第三方插件配置
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/styles/variable.less")]
    }
  }
};
