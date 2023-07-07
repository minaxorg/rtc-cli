import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import * as os from 'os'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string, options: { analyzer?: boolean; entryName?: string }) => {
  const baseConfig = createBaseConfig(folder, options.entryName)

  const plugins = [new CleanWebpackPlugin(), options.analyzer && new BundleAnalyzerPlugin()].filter(Boolean)

  const prodConfig = {
    mode: 'production',
    target: ['web', 'es6'],
    output: {
      filename: 'js/[name]-[chunkhash].js'
    },
    plugins,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.esbuildMinify,
          exclude: /\/node_modules/,
          parallel: os.cpus().length,
          terserOptions: {
            // @ts-ignore
            target: 'chrome70'
          }
        }),
        new CssMinimizerPlugin()
      ]
    }
  }
  return merge<Configuration>(baseConfig as unknown as Configuration, prodConfig as unknown as Configuration)
}

export default createConfig
