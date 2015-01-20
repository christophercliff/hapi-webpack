# hapi-webpack

[![Build Status](https://travis-ci.org/christophercliff/hapi-webpack.png?branch=master)](https://travis-ci.org/christophercliff/hapi-webpack)

A [Hapi](http://hapijs.com/) plugin for building and serving [Webpack](http://webpack.github.io/) bundles.

## Installation

```
npm install hapi-webpack
```

## Usage

```js
var Webpack = require('hapi-webpack')

server.register({
  register: Webpack,
  options: options,
}, {
  routes: {
    prefix: '/build',
  },
})
```

Webpack bundles will be served from `/build/<output_filename>.js`.

### Options

See the [webpack configuration](http://webpack.github.io/docs/configuration.html) documentation for details.

## Tests

```
$ npm test
```

## License

See [LICENSE](https://github.com/christophercliff/hapi-webpack/blob/master/LICENSE.md).
