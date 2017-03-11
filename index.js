/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const asap = require('asap')
const gruu = require('./api')
const app = gruu()

function test (title, fn) {
  if (title && typeof title === 'object') {
    app.options = Object.assign({}, app.options, title)
  } else {
    app.add(title, fn)
  }

  return test
}

asap(function () {
  app.run().then(
    () => process.exit(0),
    () => process.exit(1)
  )
})

module.exports = Object.assign(test, app)
