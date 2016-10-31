'use strict'

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
      console.error('  ---\n' + utils.diag(this, test.error))
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

utils.diag = function diagnostic (self, err) {
  var msg = err.message && err.message.length
    ? err.message
    : err.toString()
  var lines = err.stack && err.stack.length
    ? err.stack.split('\n')
    : []
  var at = lines[1].slice(lines[1].indexOf('/')) || 'no stacktrace'
  var res = ''

  res += utils.ident(`name: ${err.name}`)
  res += utils.ident(`message: ${msg}`)
  res = err.expected ? res + utils.ident(`expected: ${err.expected}`) : res
  res = err.actual ? res + utils.ident(`actual: ${err.actual}`) : res
  res += utils.ident(`at: ${at}`)

  if (self.options.showStack && err.stack && err.stack.length) {
    var stack = lines.slice(1).join('\n')
    res += utils.ident(`stack:\n${stack}`)
  }

  res += utils.ident('...', true)
  return res
}

utils.ident = function ident (str, last) {
  return `  ${str}${last ? '' : '\n'}`
}

/**
 * Expose `utils` modules
 */

module.exports = utils