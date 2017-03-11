/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

// const test = require('mukla')
const gruu = require('./dist')/* ({ showStack: true }) */
const app = gruu()
const delay = require('delay')

app.add('foo bar baz', function b (t) {
  t.strictEqual(11, 11)
})

app.add('quxie setty', function a (t) {
  return delay(400).then(() => {
    // t.strictEqual(222, 444)
    t.strictEqual(222, 222)
  })
})

app.add('zeta gama', function s (t) {
  t.strictEqual(3, 3)
})

app.run()
