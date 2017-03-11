/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

// const test = require('mukla')
const test = require('./index')/* ({ showStack: true }) */

const delay = require('delay')

test('foo bar baz', function b (t) {
  t.strictEqual(11, 11)
})

test('quxie setty', function a (t) {
  return delay(400).then(() => {
    // t.strictEqual(222, 444)
    t.strictEqual(222, 222)
  })
})

test('zeta gama', function s (t) {
  t.strictEqual(3, 3)
})
