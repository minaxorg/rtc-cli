#!/usr/bin/env node

import program, { Command } from 'commander'
import p from '../package.json'
import build from './build'
import dev from './dev'

program.version(p.version.toString())

program.command('dev').description('开发')
  .option('-c, --config <path>', '指定额外的 webpack 配置文件')
  .action((env, options: Command) => {
    dev(process.cwd(), options.opts())
  })

program.command('build').description('构建')
  .option('-c, --config <path>', '指定额外的 webpack 配置文件')
  .option('-a, --analyzer', '打开构建产物分析页面').action((env, options: Command) => {
    build(process.cwd(), options.opts())
  })

program.parse(process.argv)
