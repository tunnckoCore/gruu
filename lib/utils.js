'use strict'

var path = require('path')
var util = require('util')
var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign, no-global-assign

/**
 * Lazily required module dependencies
 */

require('always-done')
require('async')
require('common-callback-names', 'names')
require('eventemitter3', 'EventEmitter')
require('extend-shallow', 'extend')
require('forward-object', 'forward')
require('is-async-function')
require('is-typeof-error')
require('get-fn-name')
require = fn // eslint-disable-line no-undef, no-native-reassign, no-global-assign

utils.updateTest = function updateTest (test, ctx) {
  if (!test.isAsync) {
    return test
  }

  var t = test
  var name = utils.names[test.isAsync === true ? 0 : test.isAsync]
  var fnStr = test.origFunc.toString()
  fnStr = fnStr.slice(fnStr.indexOf(name) + name.length)

  if (fnStr.indexOf(name) === -1) {
    ctx.stats.ranCount++
    t.wrong = true
    t.error = new Error(`Use "${name}" callback argument of test ${test.id}!`)
    t.error.test = t
  }
  return t
}

utils.createTest = function createTest (t, opts) {
  var test = utils.extend(t, {
    id: t.origFunc && t.origFunc.id || opts.origFunc.id,
    title: t.title || opts.title,
    type: (t.isAsync || opts.isAsync) ? 'async' : 'sync'
  }, opts)

  test.title = test.skip ? test.title + ' # SKIP' : test.title
  test.title = test.todo ? test.title + ' # TODO' : test.title
  test.type = test.skip ? 'skip' : test.type
  test.type = test.todo ? 'todo' : test.type
  return test
}

utils.onSettle = function onSettle (test, opts, next) {
  return opts.settle === true
  ? next(null, test.error)
  : next(test.error)
}

utils.defaultReporter = function defaultReporter (app) {
  return (this || app)
    .once('start', function () {
      console.log('TAP version 13')
      console.log(`1..${this.tests.length}`)
    })
    .on('test', function (test) {
      if (test.wrong && test.ok === false) {
        this.emit('afterEach', test)
      }
    })
    .on('afterEach', function (test) {
      if (this.options.hideSkip && test.skip) return
      if (test.ok === false) {
        this.stats.failCount++
        this.emit('fail', test)
        return
      }
      this.emit('pass', test)
    })
    .on('pass', function (test) {
      console.log('# :)', test.title)
      console.log('ok', test.id, test.title)
    })
    .on('fail', function (test) {
      console.error('# :(', test.title)
      console.error('not ok', test.id, test.title)
      console.error(utils.diag(test.error, this.options.showStack))
    })
    .once('done', function (err, done) {
      if (typeof done === 'function') {
        return done.call(this, err)
      }

      // console.log(`# tests ${tests} (ran only ${ran} of them)`)
      console.log('# all tests', this.stats.testCount)
      console.log('# runned', this.stats.ranCount)
      console.log('# passed', this.stats.passCount)
      console.log('# failed', this.stats.failCount)
      if (this.stats.skipCount) {
        console.log('# skip', this.stats.skipCount)
      }
      if (this.stats.todoCount) {
        console.log('# todo', this.stats.todoCount)
      }
      console.log('')

      var isError = err || this.stats.failCount
      console.log('#', isError ? 'not ok' : 'ok')
      process.exit(isError ? 1 : 0)
    })
}

utils.diag = function diagnostic (err, showStack) {
  var res = ''

  // get message, or toString error object
  var msg = err.message && err.message.length
    ? err.message
    : err.toString()

  // ensure stack exists
  var stack = err.stack && err.stack.length
    ? utils.cleanStack(err.stack)
    : null

  // modify the cleaned up stacktrace if exist
  var lines = stack
    ? stack.split('\n').map(function (line) {
      // transform to relative paths
      var m = /.*\((.*)\).*/.exec(line)
      line = m && m[1]
        ? line.replace(m[1], path.relative(process.cwd(), m[1]))
        : line

      // handle correct ident of each line
      return utils.ident('  ' + line, true)
    })
    : []

  // get `at` position from first of "at" lines
  var at = lines.length
    ? lines[1].trim().slice(3)
    : null

  res += utils.ident('name: ' + err.name)
  res += utils.ident('message: ' + msg)

  // show inspected expected value if exists
  res = err.expected
    ? res + utils.ident('expected: ' + util.inspect(err.expected))
    : res

  // show inspected actual value if exists
  res = err.actual
    ? res + utils.ident('actual: ' + util.inspect(err.actual))
    : res

  res = at ? res + utils.ident('at: ' + at) : res

  // print stack trace if `showStack` option is `true`
  if (showStack && stack) {
    res += utils.ident('stack:\n' + lines.join('\n'))
  }

  res += utils.ident('...', true)
  return '  ---\n' + res
}

utils.ident = function ident (str, last) {
  return '  ' + str + (last ? '' : '\n')
}

/**
 * Expose `utils` modules
 */

module.exports = utils
