/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')
var gruu = require('./api')
var Gruu = require('./api').Gruu

function proxy (opts) {
  if (opts && typeof opts === 'object') {
    gruu.option(opts)
  } else {
    gruu.addTest.apply(gruu, arguments)
  }
  return proxy
}

setTimeout(function () {
  gruu.run()
}, 0)

module.exports = utils.forward(proxy, gruu)
module.exports.Gruu = Gruu
