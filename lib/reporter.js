/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const path = require('path')
const cleanStack = require('clean-stacktrace')

const cleanStackRelativePaths = (line) => {
  var m = /.*\((.*)\).*/.exec(line) || []
  return m[1] ? line.replace(m[1], path.relative(process.cwd(), m[1])) : line
}

module.exports = function defaultReporter (app) {
  if (typeof app.options.reporter !== 'function') {
    app.once('header', onHeader)
    app.on('pass', onPass)
    app.on('fail', onFail)
    app.once('footer', onFooter)
  } else {
    app.use(app.options.reporter)
  }

  return app
}

function onHeader () {
  console.log('TAP version 13')
}

function onPass (app, test) {
  const { title, index } = test
  console.log('# :)', title)
  console.log('ok', index, '-', title)
}

function onFail (app, test) {
  const { title, index, reason: err } = test

  console.log('# :(', title)
  console.log('not ok', index, '-', title)

  const stackLines = cleanStack(err.stack)
    .split('\n')
    .map((line) => line.trim())

  const at = cleanStackRelativePaths(stackLines[1].replace(/^at /, ''))

  console.log('  ---')
  console.log('  name:', err.name)
  console.log('  message:', err.message)

  if (err.expected) {
    console.log('  operator:', err.operator)
    console.log('  expected:', err.expected)
    console.log('  actual:  ', err.actual)
  }

  console.log('  at:', at)

  if (app.options.showStack) {
    console.log('  stack:')

    stackLines.slice(1).map((line, idx) => {
      if (idx > 0) console.log(`    ${cleanStackRelativePaths(line)}`)
    })
  }

  console.log('  ...')
}

function onFooter ({ stats }) {
  console.log('')
  console.log(`1..${stats.count}`)
  console.log('# tests', stats.count)
  console.log('# pass ', stats.pass)

  if (stats.fail) {
    console.log('# fail ', stats.fail)
    console.log('')
    process.exit(1)
  } else {
    console.log('')
    console.log('# ok')
    process.exit(0)
  }
}
