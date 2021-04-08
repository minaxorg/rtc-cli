import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import createBaseConfig from './webpack.config.base'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

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
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-router-dom': 'ReactRouterDOM'
    },
    output: {
      filename: '[name]-[chunkhash].js'
    },
    plugins
  }
  const config = merge<Configuration>(baseConfig as Configuration, prodConfig as Configuration)
  return config
}

export default createConfig
