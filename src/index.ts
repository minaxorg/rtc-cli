#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import p from '../package.json'
import build from './build'
import dev from './dev'
import chalk from 'chalk'

const program = new Command()
const log = console.log

const checkTplExists = () => {
  const isExists = fs.existsSync(path.join(process.cwd(), './index.ejs'))
  if (!isExists) {
    log(chalk.red('index.ejs 文件不存在，可执行 npx rtc-cli tpl 生成'))
    process.exit(1)
  }
}

program.version(p.version.toString())

program.command('dev').description('开发')
  .option('-c, --config <path>', '指定额外的 webpack 配置文件')
  .action((env, options: Command) => {
    checkTplExists()
    dev(process.cwd(), options.opts())
  })

program.command('build').description('构建')
  .option('-c, --config <path>', '指定额外的 webpack 配置文件')
  .option('-a, --analyzer', '打开构建产物分析页面').action((env, options: Command) => {
    checkTplExists()
    build(process.cwd(), options.opts())
  })

program.command('tpl').description('生成 html 模板').action(() => {
  fs.copyFileSync(path.resolve(__dirname, './tpl.ejs'), path.resolve(process.cwd(), './index.ejs'), fs.constants.COPYFILE_EXCL)
  log(chalk.green('生成 index.ejs 文件成功'))
})

program.parse(process.argv)
