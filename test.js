/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

// const test = require('mukla')
const test = require('./lib')/* ({ showStack: true }) */

test('foo bar baz', (t) => {
  t.strictEqual(222, 222, 'okkkey')
  // console.log('hooo')
  // t.strictEqual({ aaa: 'bbb'}, {
  //   foo: 'bar'
  // }, 'should be equal')
  // t.end()
  // console.log('actual')
})
