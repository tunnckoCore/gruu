# [gruu][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Modern, small and powerful test runner with TAP output and support for streams, promises, async/await and callbacks, built on [always-done][].

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
> Install with [npm](https://www.npmjs.com/)

```sh
$ npm i gruu --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const assert = require('assert')
const test = require('gruu')({ serial: true }) // same as test({ serial: true })

// custom reporter
test
  .on('start', (test) => {})
  .on('beforeEach', (test) => {})
  .on('test', (test) => {})
  .on('todo', (test) => {})
  .on('skip', (test) => {})
  .on('pass', (test) => {})
  .on('fail', (test) => {})
  .on('error', (test) => {})
  .on('afterEach', (test) => {})
  .on('done', (test) => {})

// can use it to pass options object
// better place is after the require
test({ showStack: true })

// normal test
test('foo bar', function () {})

// chaining
test('third test', () => {
  return 123
})(function fourthTestHere () => {
  // name of the function is
  // the name of the test :)
  return 33
})('fifth and', () => {
  assert.equal(1, 1)
})('so so on...', () => {})

// async/await
test('asynchronous title test', async function () {
  return await Promise.resolve(123)
})

// passing callback test
test('callback style test', function (done) {
  done()
})

// failing callback test
test('failing callback', (done) => {
  done(null, new Error('foo bar'))
})

// failing callback test
test('some failing test', (done) => {
  assert.strictEqual(111, 222)
  done()
})

// promise returning
test(() => {
  return Promise.resolve('foo bar baz')
})

// rejected promise
test(() => {
  return Promise.reject(new Error('foo err'))
})

// synchronous passing test
test('some synchronous title', function () {
  assert.ok(true)
})

// failing synchronous
test('some title', function () {
  assert.strictEqual(111, 222)
})
```

## API

### [test](lib/index.js#L73)

> Single and simple `test` as seen in [ava][]
and [tape][] testing. The `fn` is passed to [always-done][], so
it can support async/await, promises, streams, observables
and synchronous functions.

**Params**

* `[title]` **{String|Function|Object}**: name of the test, `fn` or options object    
* `<fn>` **{Function}**: test function to be called, passed to [always-done][]    
* `returns` **{Function}**: returns same function, which is also instance of `Gruu` and so it is eventemitter, so has `.on`, `.emit` and etc methods  

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/gruu/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[always-done]: https://github.com/hybridables/always-done
[ava]: https://ava.li
[tape]: https://github.com/substack/tape

[npmjs-url]: https://www.npmjs.com/package/gruu
[npmjs-img]: https://img.shields.io/npm/v/gruu.svg?label=gruu

[license-url]: https://github.com/tunnckoCore/gruu/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/gruu.svg

[downloads-url]: https://www.npmjs.com/package/gruu
[downloads-img]: https://img.shields.io/npm/dm/gruu.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/gruu
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/gruu.svg

[travis-url]: https://travis-ci.org/tunnckoCore/gruu
[travis-img]: https://img.shields.io/travis/tunnckoCore/gruu/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/gruu
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/gruu.svg

[david-url]: https://david-dm.org/tunnckoCore/gruu
[david-img]: https://img.shields.io/david/tunnckoCore/gruu.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

