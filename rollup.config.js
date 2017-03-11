
var buble = require('rollup-plugin-buble')
var resolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')

module.exports = {
  entry: 'api.js',
  dest: 'dist/index.js',
  plugins: [
    resolve(),
    commonjs(),
    buble(),
  ]
}
