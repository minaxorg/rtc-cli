import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string) => {
  const baseConfig = createBaseConfig(folder)
  const devConfig = {
    mode: 'development',
    output: {
      filename: '[name].js'
    },
    devtool: 'source-map',
    entry: ['webpack-hot-middleware/client', baseConfig.entry],
    plugins: [new ReactRefreshPlugin(), new webpack.HotModuleReplacementPlugin()]
  }
  const config = merge<Configuration>(baseConfig as Configuration, devConfig as Configuration)
  return config
}

export default createConfig
