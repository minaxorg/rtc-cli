import chalk from 'chalk'
import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import createConfig from './webpack/webpack.config.prod'

const log = console.log

const build = (folder: string, options: { analyzer?: boolean, config?: string }) => {
  process.env.NODE_ENV = 'production'
  let config = createConfig(folder, options)
  if (options.config) {
    config = merge(config, require(path.resolve(folder, options.config)))
  }
  log(chalk.blue('开始构建...'))
  webpack(config).run((error) => {
    if (error) {
      log(chalk.red('❌构建失败！'))
    } else {
      log(chalk.green('📦构建成功！'))
    }
  })
}

export default build
