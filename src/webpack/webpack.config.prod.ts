import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string) => {
  const baseConfig = createBaseConfig(folder)

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
    plugins: [new CleanWebpackPlugin()]
  }
  const config = merge<Configuration>(baseConfig as Configuration, prodConfig as Configuration)
  return config
}

export default createConfig
