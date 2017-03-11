'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('assert'));
var path = _interopDefault(require('path'));

/*!
 * dush <https://github.com/tunnckoCore/dush>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/**
 * > A constructor function that returns an object
 * with a few methods.
 *
 * See [JSBin Example](http://jsbin.com/mepemeluhi/edit?js,console).
 *
 * **Example**
 *
 * ```js
 * const dush = require('dush')
 * const emitter = dush()
 *
 * console.log(emitter.all) // => {}
 * console.log(emitter.on) // => Function
 * console.log(emitter.once) // => Function
 * console.log(emitter.off) // => Function
 * console.log(emitter.emit) // => Function
 * ```
 *
 * @name   dush()
 * @return {Object} methods
 * @api public
 */

function dush () {
  var all = Object.create(null);
  var app = {
    /**
     * > An listeners map of all registered events
     * and their listeners. A key/value store, where 1) value
     * is an array of event listeners for the key and 2) key
     * is the name of the event.
     *
     * See [JSBin Example](http://jsbin.com/zuwayalovi/edit?js,console).
     *
     * **Example**
     *
     * ```js
     * const emitter = dush()
     *
     * emitter.on('foo', () => {})
     * emitter.on('foo', () => {})
     * emitter.on('bar', () => {})
     *
     * console.log(emitter.all)
     * // => { foo: [Function, Function], bar: [Functon] }
     * ```
     *
     * @name  .all
     * @type {Object} `all` a key/value store of all events and their listeners
     * @api public
     */

    all: all,

    /**
     * > Add `handler` for `name` event.
     *
     * See [JSBin Example](http://jsbin.com/xeketuruto/edit?js,console).
     *
     * **Example**
     *
     * ```js
     * const emitter = dush()
     *
     * emitter
     *   .on('hi', (place) => {
     *     console.log(`hello ${place}!`) // => 'hello world!'
     *   })
     *   .on('hi', (place) => {
     *     console.log(`hi ${place}, yeah!`) // => 'hi world, yeah!'
     *   })
     *
     * emitter.emit('hi', 'world')
     * ```
     *
     * @name   .on
     * @param  {String} `name` Type of event to listen for, or `'*'` for all events
     * @param  {String} `handler` Function to call in response to given event
     * @return {Object} The `dush` instance for chaining
     * @api public
     */

    on: function on (name, handler) {
      var e = all[name] || (all[name] = []);
      e.push(handler);

      return app
    },

    /**
     * > Add `handler` for `name` event that
     * will be called only one time.
     *
     * See [JSBin Example](http://jsbin.com/teculorima/edit?js,console).
     *
     * **Example**
     *
     * ```js
     * const emitter = dush()
     * let called = 0
     *
     * emitter.once('foo', () => {
     *   console.log('called only once')
     *   called++
     * })
     *
     * emitter
     *   .emit('foo', 111)
     *   .emit('foo', 222)
     *   .emit('foo', 333)
     *
     * console.log(called) // => 1
     * ```
     *
     * @name   .once
     * @param  {String} `name` Type of event to listen for, or `'*'` for all events
     * @param  {String} `handler` Function to call in response to given event
     * @return {Object} The `dush` instance for chaining
     * @api public
     */

    once: function once (name, handler) {
      function fn (a, b, c) {
        app.off(name, fn);
        handler(a, b, c);
      }

      return app.on(name, fn)
    },

    /**
     * > Remove `handler` for `name` event. If `handler` not
     * passed will remove **all** listeners for that `name` event.
     *
     * See [JSBin Example](http://jsbin.com/nujucoquvi/3/edit?js,console).
     *
     * **Example**
     *
     * ```js
     * const emitter = dush()
     *
     * const handler = () => {
     *   console.log('not called')
     * }
     *
     * emitter.on('foo', handler)
     * emitter.off('foo', handler)
     *
     * emitter.on('foo', (abc) => {
     *   console.log('called', abc) // => 'called 123'
     * })
     * emitter.emit('foo', 123)
     *
     * // or removing all listeners of `foo`
     * emitter.off('foo')
     * emitter.emit('foo')
     * ```
     *
     * @name   .off
     * @param  {String} `name` Type of event to listen for, or `'*'` for all events
     * @param  {String} `handler` Function to call in response to given event
     * @return {Object} The `dush` instance for chaining
     * @api public
     */

    off: function off (name, handler) {
      if (handler && all[name]) {
        all[name].splice(all[name].indexOf(handler) >>> 0, 1);
      } else {
        all[name] = [];
      }

      return app
    },

    /**
     * > Invoke all handlers for given `name` event.
     * If present, `'*'` listeners are invoked too with `(type, ...rest)` signature,
     * where the `type` argument is a string representing the name of the
     * called event; and all of the rest arguments.
     *
     * See [JSBin Example](http://jsbin.com/muqujavolu/edit?js,console).
     *
     * **Example**
     *
     * ```js
     * const emitter = dush()
     *
     * emitter.on('foo', (a, b, c) => {
     *   console.log(`${a}, ${b}, ${c}`) // => 1, 2, 3
     * })
     *
     * emitter.on('*', (name, a, b, c) => {
     *   console.log(`name is: ${name}`)
     *   console.log(`rest args are: ${a}, ${b}, ${c}`)
     * })
     *
     * emitter.emit('foo', 1, 2, 3)
     * emitter.emit('bar', 555)
     * ```
     *
     * @name   .emit
     * @param  {String} `name` The name of the event to invoke
     * @param  {any} `args` Any number of arguments of any type of value, passed to each listener
     * @return {Object} The `dush` instance for chaining
     * @api public
     */

    emit: function emit (name, a, b, c) {
      (all[name] || []).map(function (handler) { handler(a, b, c); });
      (all['*'] || []).map(function (handler) { handler(name, a, b, c); });

      return app
    }
  };

  return app
}




var dush_es = Object.freeze({
	default: dush
});

var index = function (val) {
	if (val === null || val === undefined) {
		return [];
	}

	return Array.isArray(val) ? val : [val];
};

var index$2 = function (promise, onFinally) {
	onFinally = onFinally || (function () {});

	return promise.then(
		function (val) { return new Promise(function (resolve) {
			resolve(onFinally());
		}).then(function () { return val; }); },
		function (err) { return new Promise(function (resolve) {
			resolve(onFinally());
		}).then(function () {
			throw err;
		}); }
	);
};

var index$4 = function (promise) { return Promise.resolve(promise).then(
	function (value) { return ({
		isFulfilled: true,
		isRejected: false,
		value: value
	}); },
	function (reason) { return ({
		isFulfilled: false,
		isRejected: true,
		reason: reason
	}); }
); };

var index$8 = function (iterable, reducer, initVal) { return new Promise(function (resolve, reject) {
	var iterator = iterable[Symbol.iterator]();
	var i = 0;

	var next = function (total) {
		var el = iterator.next();

		if (el.done) {
			resolve(total);
			return;
		}

		Promise.all([total, el.value])
			.then(function (value) {
				next(reducer(value[0], value[1], i++));
			})
			.catch(reject);
	};

	next(initVal);
}); };

var index$6 = function (iterable, iterator) {
	var ret = [];

	return index$8(iterable, function (a, b, i) {
		return Promise.resolve(iterator(b, i)).then(function (val) {
			ret.push(val);
		});
	}).then(function () { return ret; });
};

var index$10 = function (iterable, mapper, opts) { return new Promise(function (resolve, reject) {
	opts = Object.assign({
		concurrency: Infinity
	}, opts);

	var concurrency = opts.concurrency;

	if (concurrency < 1) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}

	var ret = [];
	var iterator = iterable[Symbol.iterator]();
	var isRejected = false;
	var iterableDone = false;
	var resolvingCount = 0;
	var currentIdx = 0;

	var next = function () {
		if (isRejected) {
			return;
		}

		var nextItem = iterator.next();
		var i = currentIdx;
		currentIdx++;

		if (nextItem.done) {
			iterableDone = true;

			if (resolvingCount === 0) {
				resolve(ret);
			}

			return;
		}

		resolvingCount++;

		Promise.resolve(nextItem.value)
			.then(function (el) { return mapper(el, i); })
			.then(
				function (val) {
					ret[i] = val;
					resolvingCount--;
					next();
				},
				function (err) {
					isRejected = true;
					reject(err);
				}
			);
	};

	for (var i = 0; i < concurrency; i++) {
		next();

		if (iterableDone) {
			break;
		}
	}
}); };

var utils = {};

utils.flow = function (options) { return options.serial ? index$6 : index$10; };
utils.reflect = function (promise, notify) { return index$4(promise).then(notify); };

utils.map = function (app, mapper) {
  var flow = utils.flow(app.options);
  var promise = flow(app.tests, mapper, app.options);

  return index$2(promise, function () { return app.emit('footer', app); })
};

utils.try = function (fn, args) { return function () { return new Promise(function (resolve) {
  resolve(fn.apply(null, index(args)));
}); }; };

var utils_1 = utils;

var index$14 = function (fn) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	return fn.displayName || fn.name || (/function ([^\(]+)?\(/.exec(fn.toString()) || [])[1] || null;
};

/**
 * > Trying to get the name of `val` function.
 *
 * **Example**
 *
 * ```js
 * var name = require('get-fn-name')
 *
 * console.log(name(function () { return 1 })) // => null
 * console.log(name(function named () { return 2 })) // => 'named'
 *
 * // arrows
 * console.log(name(() => 3)) // => null
 * console.log(name(() => { return 4 })) // => null
 * console.log(name((a, b, c) => a + b + c)) // => null
 * console.log(name((a, b) => { return a + b })) // => null
 * ```
 *
 * @param  {Function} `val` Regular or arrow (es2015/es6, also know as `fat arrow`) function.
 * @return {String|null} The name of function or `null` otherwise.
 * @api public
 */

var index$12 = function getFnName (val) {
  val = index$14(val);
  val = val ? val.replace(/^bound/, '') : null;
  val = val ? val.trim() : null;
  return val
};

/*!
 * stack-utils-node-internals <https://github.com/tunnckoCore/stack-utils-node-internals>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

var natives = Object.keys(process.binding('natives')).concat([
  'bootstrap_node',
  'node'
]);

function nodeInternals () {
  return natives
    .map(function (n) {
      return new RegExp('\\(' + n + '\\.js:\\d+:\\d+\\)$')
    })
    .concat([
      /\s*at (bootstrap_)?node\.js:\d+:\d+?$/,
      /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/
    ])
}

nodeInternals.natives = natives;
var natives_1 = natives;
var index$18 = nodeInternals;

index$18.natives = natives_1;

var regex = /(?:(?:(?:node|(?:internal\/|.*node_modules\/babel-polyfill\/.*)\w+)\.js:\d+:\d+)|native)/;


/**
 * > Removes mostly not needed internal Nodejs entries.
 * If you pass `mapper` function, you can make more
 * changes to each line of the stack - for example making
 * the paths to be relative, not absolute.
 *
 * **Example**
 *
 * ```js
 * var cleanStack = require('clean-stacktrace')
 * var error = new Error('Missing unicorn')
 *
 * console.log(error.stack)
 * // =>
 * // Error: Missing unicorn
 * //     at Object.<anonymous> (/Users/sindresorhus/dev/clean-stack/unicorn.js:2:15)
 * //     at Module._compile (module.js:409:26)
 * //     at Object.Module._extensions..js (module.js:416:10)
 * //     at Module.load (module.js:343:32)
 * //     at Function.Module._load (module.js:300:12)
 * //     at Function.Module.runMain (module.js:441:10)
 * //     at startup (node.js:139:18)
 *
 * console.log(cleanStack(error.stack))
 * // =>
 * // Error: Missing unicorn
 * //     at Object.<anonymous> (/Users/sindresorhus/dev/clean-stack/unicorn.js:2:15)
 *
 * // or making paths relative
 * var path = require('path')
 * var stack = clean(error.stack, (line) => {
 *   var m = /.*\((.*)\).?/.exec(line) || []
 *   return m[1] ? line.replace(m[1], path.relative(process.cwd(), m[1])) : line
 * })
 * // =>
 * // Error: Missing unicorn
 * //     at Object.<anonymous> (unicorn.js:2:15)
 * ```
 *
 * @param  {String} `stack` an error stack trace
 * @param  {Function} `mapper` more customization for each line
 * @return {String} modified and cleaned stack
 * @api public
 */

var index$16 = function cleanStacktrace (stack, mapper) {
  if (!Array.isArray(stack)) {
    stack = stack.split('\n');
  }

  var result = [];
  var internals = index$18().concat(regex);

  if (!(/^\s*at /.test(stack[0])) && (/^\s*at /i.test(stack[1]))) {
    result.push(stack[0]);
    stack = stack.slice(1);
  }

  stack.forEach(function (line) {
    var isInternal = internals.some(function (internal) {
      return internal.test(line)
    });

    if (isInternal) {
      return null
    }

    result.push(line);
  });

  result = typeof mapper === 'function' ? result.map(mapper) : result;

  return result.join('\n')
};

var cleanStackRelativePaths = function (line) {
  var m = /.*\((.*)\).*/.exec(line) || [];
  return m[1] ? line.replace(m[1], path.relative(process.cwd(), m[1])) : line
};

var reporter$1 = function defaultReporter (app) {
  app.once('header', onHeader);
  app.on('pass', onPass);
  app.on('fail', onFail);
  app.once('footer', onFooter);

  return app
};

function onHeader () {
  console.log('TAP version 13');
}

function onPass (app, test) {
  var title = test.title;
  var index = test.index;
  console.log('# :)', title);
  console.log('ok', index, '-', title);
}

function onFail (app, test) {
  var title = test.title;
  var index = test.index;
  var err = test.reason;

  console.log('# :(', title);
  console.log('not ok', index, '-', title);

  var stackLines = index$16(err.stack)
    .split('\n')
    .map(function (line) { return line.trim(); });

  var at = cleanStackRelativePaths(stackLines[1].replace(/^at /, ''));

  console.log('  ---');
  console.log('  name:', err.name);
  console.log('  message:', err.message);

  if (err.expected) {
    console.log('  operator:', err.operator);
    console.log('  expected:', err.expected);
    console.log('  actual:  ', err.actual);
  }

  console.log('  at:', at);

  if (app.options.showStack) {
    console.log('  stack:');

    stackLines.slice(1).map(function (line, idx) {
      console.log(("    " + (cleanStackRelativePaths(line))));
    });
  }

  console.log('  ...');
}

function onFooter (ref) {
  var stats = ref.stats;

  console.log('');
  console.log(("1.." + (stats.count)));
  console.log('# tests', stats.count);
  console.log('# pass ', stats.pass);

  if (stats.fail) {
    console.log('# fail ', stats.fail);
    console.log('');
    process.exit(1);
  } else {
    console.log('');
    console.log('# ok');
    process.exit(0);
  }
}

var dush$2 = ( dush_es && dush ) || dush_es;

var reporter = reporter$1;

var api = function gruu (options) {
  var ref = dush$2();
  var on = ref.on;
  var off = ref.off;
  var once = ref.once;
  var emit = ref.emit;
  var app = {
    on: on,
    off: off,
    once: once,
    emit: emit,
    tests: [],
    stats: {
      pass: 0,
      fail: 0,
      count: 0,
      anonymous: 0
    },
    options: Object.assign({
      showStack: false,
      serial: false,
      settle: true,
      args: assert
    }, options),

    use: function use (plugin) {
      return plugin(app) || app
    },

    add: function add (title, fn) {
      if (typeof title === 'function') {
        fn = title;
        title = null;
      }
      if (typeof fn !== 'function') {
        throw new TypeError('.add: expect `fn` to be a function')
      }

      title = typeof title === 'string' ? title : index$12(fn);
      if (title === null) {
        app.stats.anonymous++;
      }

      app.stats.count++;

      var test = {
        title: title,
        index: app.tests.length + 1,
        fn: utils_1.try(fn, app.options.args)
      };

      app.tests.push(test);
      return app
    },

    run: function run (options) {
      app.options = Object.assign({}, app.options, options);
      reporter = typeof app.options.reporter === 'function'
        ? app.options.reporter
        : reporter;

      app.use(reporter);
      app.emit('header', app);

      function mapper (test) {
        app.emit('beforeEach', app, test);

        var promise = test.fn();
        var notify = function (result) {
          test = Object.assign({}, test, result);
          app.emit('afterEach', app, test);

          if (test.isRejected) {
            app.stats.fail++;
            app.emit('fail', app, test);
          } else {
            app.stats.pass++;
            app.emit('pass', app, test);
          }

          if (test.isRejected && app.options.settle === false) {
            throw test.reason
          } else {
            return test
          }
        };

        return utils_1.reflect(promise, notify)
      }

      return utils_1.map(app, mapper)
    }
  };

  return app
};

module.exports = api;
