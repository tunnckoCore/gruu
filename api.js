/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const dush = require('dush')
const utils = require('./lib/utils')
const assert = require('assert')
const getName = require('get-fn-name')
let reporter = require('./lib/reporter')

module.exports = function gruu (options) {
  const { on, off, once, emit } = dush()
  const app = {
    on,
    off,
    once,
    emit,
    tests: [],
    stats: {
      pass: 0,
      fail: 0,
      count: 0,
      anonymous: 0
    },
    options: Object.assign({
      showStack: false,
      serial: false,
      settle: true,
      args: assert
    }, options),

    use (plugin) {
      return plugin(app) || app
    },

    add (title, fn) {
      if (typeof title === 'function') {
        fn = title
        title = null
      }
      if (typeof fn !== 'function') {
        throw new TypeError('.add: expect `fn` to be a function')
      }

      title = typeof title === 'string' ? title : getName(fn)
      if (title === null) {
        app.stats.anonymous++
      }

      app.stats.count++

      const test = {
        title,
        index: app.tests.length + 1,
        fn: utils.try(fn, app.options.args)
      }

      app.tests.push(test)
      return app
    },

    run (options) {
      app.options = Object.assign({}, app.options, options)
      reporter = typeof app.options.reporter === 'function'
        ? app.options.reporter
        : reporter

      app.use(reporter)
      app.emit('header', app)

      function mapper (test) {
        app.emit('beforeEach', app, test)

        const promise = test.fn()
        const notify = (result) => {
          test = Object.assign({}, test, result)
          app.emit('afterEach', app, test)

          if (test.isRejected) {
            app.stats.fail++
            app.emit('fail', app, test)
          } else {
            app.stats.pass++
            app.emit('pass', app, test)
          }

          if (test.isRejected && app.options.settle === false) {
            throw test.reason
          } else {
            return test
          }
        }

        return utils.reflect(promise, notify)
      }

      return utils.map(app, mapper)
    }
  }

  return app
}
