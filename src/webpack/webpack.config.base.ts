import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'

const createConfig = (folder: string) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  const postcssLoaderConfig = {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [
          [
            require.resolve('postcss-preset-env'),
            {
              autoprefixer: {
                overrideBrowserslist: ['Chrome > 38', 'ie >= 8']
              }
            }
          ]
        ]
      },
      sourceMap: isDevelopment
    }
  }

  const cssLoaderConfig = {
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        // node_modules 目录下的样式文件 auto 设置为 false
        auto: (resourcePath: string) => !resourcePath.includes('/node_modules/'),
        localIdentName: '[local]-[hash:base64:8]'
      }
    }
  }

  return {
    entry: path.resolve(folder, './src/index'),
    output: {
      path: path.resolve(folder, './dist'),
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(folder, './src')
      }
    },
    module: {
      rules: [
        {
          test: /\.(bmp|png|jpg|gif|ttf|otf|svg|woff|woff2|docx|doc|xls|xlsx|ppt|pptx)$/,
          type: 'asset',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        },
        {
          test: /\.tsx?$/,
          include: path.join(folder, 'src'),
          use: [
            isDevelopment && {
              loader: require.resolve('babel-loader'),
              options: { plugins: [require.resolve('react-refresh/babel')] }
            },
            {
              loader: require.resolve('ts-loader'),
              options: { transpileOnly: true }
            }
          ].filter(Boolean)
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
            require.resolve('css-loader'),
            postcssLoaderConfig
          ].filter(Boolean)
        },
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
            cssLoaderConfig,
            postcssLoaderConfig,
            require.resolve('sass-loader'),
            fs.existsSync(path.resolve(folder, './src/styles/var.scss')) && {
              loader: require.resolve('sass-resources-loader'),
              options: {
                // 将 var.scss 引入到每个 scss 文件，方便每个文件直接使用变量
                resources: [path.resolve(folder, './src/styles/var.scss')],
                hoistUseStatements: true
              }
            }
          ].filter(Boolean)
        },
        {
          test: /\.less$/,
          use: [
            require.resolve('style-loader'),
            cssLoaderConfig,
            postcssLoaderConfig,
            {
              loader: require.resolve('less-loader'),
              options: {
                lessOptions: {
                  javascriptEnabled: true
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      !isDevelopment && new MiniCssExtractPlugin({ filename: 'css/[name]-[chunkhash].css' }),
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        // package.json 中新增 appName 字段
        title: require(path.resolve(folder, './package.json')).appName || 'Untitled',
        template: path.resolve(folder, './index.ejs'),
        env: process.env.NODE_ENV,
        scriptLoading: 'blocking'
      })
    ].filter(Boolean)
  }
}

export default createConfig
