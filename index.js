/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var util = require('util')
var utils = require('./lib/utils')

function Gruu (options) {
  if (!(this instanceof Gruu)) {
    return new Gruu(options)
  }
  utils.EventEmitter.call(this)

  this.options = utils.extend({
    serial: false,
    settle: true,
    showStack: false
  }, options)

  this.tests = []
  this.tests.errors = null
  this.test = { context: this.options.context || {} }
  this.stats = {
    testCount: 0,
    skipCount: 0,
    todoCount: 0,
    passCount: 0,
    failCount: 0,
    anonCount: 0,
    ranCount: 0
  }
}

util.inherits(Gruu, utils.EventEmitter)

Gruu.prototype.option = function option (opts) {
  this.options = utils.extend({}, this.options, opts)
  this.test = { context: this.options.context || this.test.context }
  return this
}

Gruu.prototype.todo = function addTodoTest (title) {
  return this.addTest(title, function noop () {}, { todo: true })
}

Gruu.prototype.skip = function addSkipTest (title, fn) {
  return this.addTest(title, fn, { skip: true })
}

Gruu.prototype.addTest = function addTest (title, fn, opts) {
  if (fn && typeof fn === 'object') {
    opts = fn
    fn = title
  }
  if (typeof title === 'function') {
    fn = title
    title = null
  }
  if (typeof fn !== 'function') {
    throw new TypeError('.addTest: expect `fn` to be a function')
  }

  title = typeof title === 'string' ? title : utils.getFnName(fn)

  if (title === null) {
    this.stats.anonCount = this.stats.anonCount + 1
  }

  title = title || '(unnamed test ' + this.stats.anonCount + ')'
  fn.id = this.tests.length + 1

  var test = utils.createTest({
    ok: false,
    ran: false,
    error: null
  }, utils.extend(opts, {
    title: title,
    origFunc: fn,
    isAsync: utils.isAsyncFunction(fn, null, false)
  }))

  this.stats.skipCount = test.skip ? this.stats.skipCount + 1 : this.stats.skipCount
  this.stats.todoCount = test.todo ? this.stats.todoCount + 1 : this.stats.todoCount
  this.stats.testCount++
  this.tests.push(test)
  return this
}

Gruu.prototype.run = function run (options, done) {
  if (options && typeof options === 'function') {
    var cb = options
    options = done
    done = cb
  }
  if (options && typeof options === 'object') {
    this.options = utils.extend({}, this.options, options)
  }

  var callback = typeof done === 'function' ? done : null
  var reporter = typeof this.options.reporter === 'function'
    ? this.options.reporter
    : utils.defaultReporter

  reporter.call(this, this)
  var flow = this.options.serial === true
    ? utils.async.mapSeries
    : utils.async.map

  this.emit('start', this)
  flow(this.tests, (test, next) => {
    test = utils.updateTest(test, this)

    this.emit('beforeEach', test)
    this.emit('test', test)

    if (test.wrong) {
      test.ok = false
      return utils.onSettle(test, this.options, next)
    }

    if (test.skip || test.todo) {
      test.ok = true
      this.emit(test.type, test)
      this.emit('afterEach', test)
      return utils.onSettle(test, this.options, next)
    }

    var self = this
    utils.alwaysDone(test.origFunc, function doneCallback (err, res) {
      self.stats.ranCount++

      if (!utils.isTypeofError(err)) {
        test.ok = true
        self.stats.passCount++
        self.emit('afterEach', test, res)
        return next(null, res)
      }

      test.ok = false
      test.error = err
      self.emit('afterEach', test)

      utils.onSettle(test, self.options, next)
    })
  }, (err) => {
    this.emit('done', err, callback)
  })
}

module.exports = new Gruu()
module.exports.Gruu = Gruu
