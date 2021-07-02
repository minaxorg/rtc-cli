import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import createBaseConfig from './webpack.config.base'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

const createConfig = (folder: string, options: { analyzer?: boolean }) => {
  const baseConfig = createBaseConfig(folder)

  const plugins: Configuration['plugins'] = [new CleanWebpackPlugin()]

  if (options.analyzer) {
    plugins.push(
      new BundleAnalyzerPlugin()
    )
  }

  const prodConfig = {
    mode: 'production',
    output: {
      libraryTarget: 'system',
      filename: '[name]-[chunkhash].js'
    },
    externals: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    plugins,
    optimization: {
      minimizer: [
        new CssMinimizerPlugin()
      ]
    }
  }
  const config = merge<Configuration>(baseConfig as Configuration, prodConfig as Configuration)
  return config
}

export default createConfig
