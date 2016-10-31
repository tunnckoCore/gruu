/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var assert = require('assert')

// get it from `lib/index.js` it will be the
// main default export
var test = require('./lib')({
  settle: true,
  showStack: false,
  hideSkip: false
})

test('one', function () {
  assert.strictEqual(1, 1)
})

// test.todo('two (sync todo)', function () {
//   assert.strictEqual(1, 1)
// })

test(function sasa (next) {
  assert.strictEqual(1, 1)
  next()
})

test.skip('four (skip)', function () {
  assert.strictEqual(2121, 2121)
})

test('foo', function () {
  assert.strictEqual(55, 55)
})

// test('six (async failing arg)', function (cb) {
//   assert.strictEqual(123, 123)
// })

test('bar', function () {
  assert.strictEqual(33, 33)
})

// test('eight (sync fail)', function () {
//   throw new Error('aloha')
// })

test('nine', function () {
  assert.strictEqual(2, 2)
})

test.todo('ten (sync todo fail)', function () {
  throw new Error('aloha', ctx) // eslint-disable-line no-undef
})

test('eleven (async last)', function (callback) {
  assert.strictEqual(44, 44)
  fs.stat('./package.json', callback)
})
