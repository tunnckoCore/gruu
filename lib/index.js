/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')
var gruu = require('../index')
var Gruu = require('./index').Gruu

/**
 * Makes a proxy function, which allow us
 * to do cool things require-ing the module.
 *
 * **Example**
 *
 * ```js
 * const test = require('gruu')
 *
 * // custom reporter
 * test
 *   .on('start', (test) => {})
 *   .on('beforeEach', (test) => {})
 *   .on('test', (test) => {})
 *   .on('todo', (test) => {})
 *   .on('skip', (test) => {})
 *   .on('pass', (test) => {})
 *   .on('fail', (test) => {})
 *   .on('error', (test) => {})
 *   .on('afterEach', (test) => {})
 *   .on('done', (test) => {})
 *
 * // passing options object
 * test({ showStack: true })
 *
 * // normal test
 * test('foo bar', function () {})
 *
 * // chaining
 * test('third test', () => {
 *   return 123
 * })(function fourthTestHere () => {
 *   // name of the function is
 *   // the name of the test :)
 *   return 33
 * })('fifth and', () => {
 *   assert.equal(1, 1)
 * })('so so on...', () => {})
 * ```
 *
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */

function proxy (opts) {
  if (opts && typeof opts === 'object') {
    gruu.option(opts)
  } else {
    gruu.addTest.apply(gruu, arguments)
  }
  return proxy
}

/**
 * > Call the tests after they are defined
 * optionally pass a function to `.run` method
 */

setTimeout(function () {
  gruu.run()
}, 0)

module.exports = utils.forward(proxy, gruu)
module.exports.Gruu = Gruu
