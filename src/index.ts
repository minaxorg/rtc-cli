#!/usr/bin/env ts-node

import program from 'commander'
import p from '../package.json'

program.version(p.version.toString())

program.parse(process.argv)
