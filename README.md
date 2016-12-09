[![Build Status](https://travis-ci.org/niklasi/halland-proxy.svg?branch=master)](https://travis-ci.org/niklasi/halland-proxy)
[![Build status](https://ci.appveyor.com/api/projects/status/x89e2idtje0g4am9?svg=true)](https://ci.appveyor.com/project/niklasi/halland-proxy)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Halland-Proxy

A http debugging proxy.

# Install

Download the latest relase [here](https://github.com/niklasi/halland-proxy/releases).

# Install (developer)

1. git clone https://github.com/niklasi/halland-proxy.git
2. cd halland-proxy
3. npm install
4. npm start (DEBUG=halland\* npm start to see debug information)

# Plugins

Halland-Proxy supports plugins and uses npm to install them. This means that you have to have npm installed
on your machine to be able to install any plugins. Note that you don't have to publish your plugin to npm if
you don't want to. npm can install packages from various places like your local file system or any git repository.
You can read more about it here: https://docs.npmjs.com/how-npm-works/packages

To install plugins just edit your ~/.halland-proxy.js and the plugin-name to the plugins array.

    module.exports = {
      ...
      plugins: [plugin-name-from-npm, github-username/plugin-name-from-github]
    }

# How to write a plugin

At the moment it is only possible to write plugins for the proxy functionality and not the ui.
This will change in the future and it is possible that the plugin-api will change.

A plugin is just a normal node module that exports a function that returns an object with at least one 
of the following properties.

    module.exports = function myPlugin () {
      return {
        requestSetup: [
          function (options) {
            /*
              options.headers = {name: value}
              options.method = '' (GET, POST, ...)
              options.httpVersion = '' (1.0, 1.1)
              options.protocol = '' (http:, https:)
              options.hostname = '' (host.com)
              options.port = '' (80, 443, ...)
              options.path = '' (/p/a/t/h?query=string)
            */
            return options
          }
        ],
        requestPipe: [
          function (request) {
            /*
            request = http.IncomingMessage (See nodejs documentation for more info)
            Return a nodejs transform stream. A handy way to create transform streams
            is to use the module through2. 
            */
            return TransformStream
          }
        ],
        responseHeaders: [
          function (headers) {
            /*
              headers = {name: value}
            */
            return headers
          }
        ],
        responsePipe: [
          function (requestInfo, responseHeaders) {
            /*
            proxyResponse = http.IncomingMessage (See nodejs documentation for more info)
            requestInfo = This is the object that is returned from requestSetup
            responseHeaders = {name: value}
            Return a nodejs transform stream. A handy way to create transform streams
            is to use the module through2. 
            */
            return TranformStream
          }
        ]
      }
    }

For more information see the examples folder.

# TODO

- [ ] TLS
- [ ] Websockets
- [ ] UI-plugins
- [ ] A lot of other stuff...

# License

ISC (see LICENSE file)

Read more about ISC here: http://choosealicense.com/licenses/isc
