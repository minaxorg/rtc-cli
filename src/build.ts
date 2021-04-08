import createConfig from './webpack/webpack.config.prod'
import webpack from 'webpack'
import chalk from 'chalk'

const log = console.log

const build = (folder: string, options: { analyzer?: boolean }) => {
  process.env.NODE_ENV = 'production'
  const config = createConfig(folder, options)
  log(chalk.blue('开始构建...'))
  log(chalk.blue('index.html 中需提供 react、react-dom、react-router-dom 的 cdn 文件'))
  webpack(config).run((error) => {
    if (error) {
      log(chalk.red('❌构建失败！'))
    } else {
      log(chalk.green('📦构建成功！'))
    }
  })
}

export default build
