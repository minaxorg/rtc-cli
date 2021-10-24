import chalk from 'chalk'
import express from 'express'
import path from 'path'
import webpack from 'webpack'
import createConfig from './webpack/webpack.config.dev'
import fs from 'fs'
import http from 'http'
import https from 'https'

const key = fs.readFileSync(path.resolve(__dirname, './ssl.key'))
const cert = fs.readFileSync(path.resolve(__dirname, './ssl.crt'))

const port = 8800

const app = express()

const ip = '127.0.0.1'

const startServer = (port: number, ssl: boolean) => {
  let server
  if (ssl) {
    server = https.createServer({ key, cert }, app)
  } else {
    server = http.createServer(app)
  }
  server
    .listen(port, () => {
      log(chalk.green(`\n开发服务启动成功。${ssl ? '注：你启用了 https 开发服务。' : ''}`))
      log(chalk.green(`\nhttp${ssl ? 's' : ''}://${ip}:${port}`))
    })
    .on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        log(chalk.red(`\n${port} 端口被占用，请使用 -p 指定其他端口`))
        process.exit(0)
      } else {
        process.exit(1)
      }
    })
}

const log = console.log

const dev = (folder: string, options: { port?: number; config?: string, ssl?: boolean }) => {
  process.env.NODE_ENV = 'development'

  const config = createConfig(folder, { config: options.config, port: options.port || port, ssl: options.ssl })

  const compiler = webpack({ ...config, stats: { preset: 'minimal' } })

  app.use(require('webpack-dev-middleware')(compiler, {
    headers: () => {
      return {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }))

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
  startServer(options.port ? options.port : port, !!options.ssl)
}

export default dev
