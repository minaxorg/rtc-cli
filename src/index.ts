#!/usr/bin/env node

import program, { Command } from 'commander'
import p from '../package.json'
import build from './build'
import dev from './dev'

program.version(p.version.toString())

program.command('dev').description('开发').action((cmd) => {
  dev(process.cwd())
})

program.command('build').description('构建').option('-a, --analyzer', '打开构建产物分析页面').action((env, options: Command) => {
  build(process.cwd(), options.opts())
})

program.parse(process.argv)
