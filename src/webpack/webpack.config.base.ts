import HtmlWebpackPlugin from 'html-webpack-plugin'
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

  return {
    entry: path.resolve(folder, './src/index'),
    output: {
      path: path.resolve(folder, './dist')
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
          test: /\.(bmp|png|jpg|gif|ttf|svg|woff|woff2)$/,
          type: 'asset'
        },
        {
          test: /\.tsx?$/,
          include: path.join(folder, 'src'),
          use: [
            isDevelopment && {
              loader: require.resolve('babel-loader'),
              options: { plugins: ['react-refresh/babel'] }
            },
            {
              loader: require.resolve('ts-loader'),
              options: { transpileOnly: true }
            }
          ].filter(Boolean)
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', postcssLoaderConfig]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  localIdentName: '[local]-[hash:base64:8]'
                }
              }
            },
            postcssLoaderConfig,
            'sass-loader',
            {
              loader: require.resolve('sass-resources-loader'),
              options: {
                // 将 var.scss 引入到每个 scss 文件，方便每个文件直接使用变量
                resources: [path.resolve(folder, './src/styles/var.scss')]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        // package.json 中新增 appName 字段
        title: require(path.resolve(folder, './package.json')).appName || 'Untitled',
        template: path.resolve(folder, './index.html'),
        env: process.env.NODE_ENV
      })
    ]
  }
}

export default createConfig
