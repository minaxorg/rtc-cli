import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string, options: { analyzer?: boolean }) => {
  const baseConfig = createBaseConfig(folder)

  const plugins = [new CleanWebpackPlugin(), options.analyzer && new BundleAnalyzerPlugin()].filter(Boolean)

  const prodConfig = {
    mode: 'production',
    output: {
      filename: 'js/[name]-[chunkhash].js'
    },
    plugins,
    optimization: {
      minimizer: [
        new CssMinimizerPlugin()
      ]
    }
  }
  const config = merge<Configuration>(baseConfig as unknown as Configuration, prodConfig as unknown as Configuration)
  return config
}

export default createConfig
