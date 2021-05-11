import chalk from 'chalk'
import express from 'express'
import path from 'path'
import openBrowser from 'react-dev-utils/openBrowser'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import createConfig from './webpack/webpack.config.dev'

const port = 8800

const app = express()

const ip = '127.0.0.1'

const startServer = (port: number) => {
  app
    .listen(port, () => {
      if (openBrowser(`http://${ip}:${port}`)) {
        log(chalk.green(`\n开发服务启动成功。http://${ip}:${port}`))
      }
    })
    .on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        log(chalk.red(`\n${port} 端口被占用，尝试 ${port + 1} 端口`))
        startServer(++port)
      } else {
        throw new Error('Unknown Error')
      }
    })
}

const log = console.log

const dev = (folder: string, options: { config?: string }) => {
  process.env.NODE_ENV = 'development'
  let config = createConfig(folder)
  if (options.config) {
    config = merge(config, require(path.resolve(folder, options.config)))
  }
  const compiler = webpack({ ...config, stats: { preset: 'minimal' } })

  app.use(require('webpack-dev-middleware')(compiler))

  app.use(require('webpack-hot-middleware')(compiler))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie'
    )
    next()
  })

  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
  log(chalk.blue('\n启动开发服务...'))
  startServer(port)
}

export default dev
