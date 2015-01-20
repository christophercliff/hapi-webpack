var _ = require('lodash')
var path = require('path')
var pkg = require('../package.json')
var webpack = require('webpack')

exports.register = register

register.attributes = {
    pkg: pkg,
}

function register(server, options, next) {
    webpack(options, function (err, _stats) {
        if (err) return next(err)
        var stats = _stats.toJson()
        var paths = stats.assets.map(function (asset) {
            var _path = '/' + asset.name
            server.route({
                method: 'GET',
                path: _path,
                handler: {
                    file: path.resolve(options.output.path, asset.name),
                },
            })
            return _path
        })
        _.extend(server.app, {
            webpack: {
                configuration: options,
                stats: stats,
                paths: paths,
            },
        })
        return next(undefined)
    })
}
