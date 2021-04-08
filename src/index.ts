#!/usr/bin/env node

import program from 'commander'
import p from '../package.json'
import build from './build'
import dev from './dev'

program.version(p.version.toString())

program.command('dev').description('开发').action((cmd) => {
  dev(process.cwd())
})

program.command('build').description('构建').action((cmd) => {
  build(process.cwd())
})

program.parse(process.argv)
