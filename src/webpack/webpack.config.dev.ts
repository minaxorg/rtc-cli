import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import path from 'path'
import createBaseConfig from './webpack.config.base'

const createConfig = (folder: string, options: { config?: string; port: number; ssl?: boolean }) => {
  const baseConfig = createBaseConfig(folder)
  const extraConfig = options.config ? require(path.resolve(folder, options.config)) : {}
  let origin = '127.0.0.1'
  if (extraConfig.output && extraConfig.output.publicPath) {
    try {
      const url = new URL(extraConfig.output.publicPath)
      origin = url.hostname
    } catch (error) {
      // nothing
    }
  }
  const hmrPath = `http${options.ssl ? 's' : ''}://${origin}:${options.port}/__webpack_hmr`
  // console.log(hmrPath)
  const devConfig = {
    mode: 'development',
    output: {
      filename: 'js/[name].js'
    },
    devtool: 'source-map',
    entry: [`webpack-hot-middleware/client?path=${hmrPath}`, baseConfig.entry],
    plugins: [new ReactRefreshPlugin(), new webpack.HotModuleReplacementPlugin()]
  }
  const config = merge<Configuration>(baseConfig as unknown as Configuration, devConfig as unknown as Configuration, extraConfig)
  return config
}

export default createConfig
