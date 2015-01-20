var _ = require('lodash')
var async = require('async')
var fs = require('fs')
var Hapi = require('hapi')
var path = require('path')
var url = require('url')
var Webpack = require('../')
var Wreck = require('wreck')

var PREFIX = '/build'

describe('the plugin', function () {

    var server = new Hapi.Server()

    server.connection({
        host: '127.0.0.1',
        port: 3001,
    })

    before(function (done) {
        async.series([
            async.apply(server.register.bind(server), {
                register: Webpack,
                options: {
                    context: path.resolve(__dirname, './src/'),
                    devtool: 'source-map',
                    entry: {
                        index: './index',
                    },
                    output: {
                        filename: '[name]-[hash].js',
                        path: path.resolve(__dirname, './build/'),
                    },
                },
            }, {
                routes: {
                    prefix: PREFIX,
                },
            }),
            server.start.bind(server),
        ], done)
    })

    after(function (done) {
        server.stop(done)
    })

    it('should build and route', function (done) {
        var gets = server.app.webpack.stats.assets
            .map(function (asset) {
                return url.resolve(server.info.uri, path.join(PREFIX, asset.name))
            })
            .map(function (url) {
                return async.apply(Wreck.get.bind(Wreck), url)
            })
        async.parallel(gets, function (err, responses) {
            if (err) return done(err)
            var js = _.last(responses[0])
            var map = _.last(responses[1])
            js.should.equal(fs.readFileSync(path.resolve(__dirname, './build/', server.app.webpack.stats.assets[0].name), 'utf8'))
            map.should.equal(fs.readFileSync(path.resolve(__dirname, './build/', server.app.webpack.stats.assets[1].name), 'utf8'))
            return done()
        })
    })

})
