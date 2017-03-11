/*!
 * gruu <https://github.com/tunnckoCore/gruu>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const arrayify = require('arrify')
const pFinally = require('p-finally')
const pReflect = require('p-reflect')
const pMapSeries = require('p-map-series')
const pMapParallel = require('p-map')

const utils = {}

utils.flow = (options) => options.serial ? pMapSeries : pMapParallel
utils.reflect = (promise, notify) => pReflect(promise).then(notify)

utils.map = (app, mapper) => {
  const flow = utils.flow(app.options)
  const promise = flow(app.tests, mapper, app.options)

  return pFinally(promise, () => app.emit('footer', app))
}

utils.try = (fn, args) => () => new Promise((resolve) => {
  resolve(fn.apply(null, arrayify(args)))
})

module.exports = utils
