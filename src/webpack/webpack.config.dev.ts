import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string, options: { port: number; ssl?: boolean }) => {
  const baseConfig = createBaseConfig(folder)
  const path = `http${options.ssl ? 's' : ''}://127.0.0.1:${options.port}/__webpack_hmr`
  const devConfig = {
    mode: 'development',
    output: {
      filename: 'js/[name].js'
    },
    devtool: 'source-map',
    entry: [`webpack-hot-middleware/client?path=${path}`, baseConfig.entry],
    plugins: [new ReactRefreshPlugin(), new webpack.HotModuleReplacementPlugin()]
  }
  const config = merge<Configuration>(baseConfig as unknown as Configuration, devConfig as unknown as Configuration)
  return config
}

export default createConfig
