[![Build Status](https://travis-ci.org/niklasi/halland-proxy.svg?branch=master)](https://travis-ci.org/niklasi/halland-proxy)
[![Build status](https://ci.appveyor.com/api/projects/status/x89e2idtje0g4am9?svg=true)](https://ci.appveyor.com/project/niklasi/halland-proxy)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Halland-Proxy

Halland-Proxy is cross platform http debugging proxy written in javascript (Electron). Halland-Proxy is open source and completely free.
The goal of the project is to make a fast, stable and extensible application. The application will contain basic functionality, but most of
its features will be provided by plugins.

It is still, very much, a work in progress and a lot of things can still change. For example the plugin model is likely to change in the future...

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

    module.exports = function myPlugin (request, response) {
      return {
        requestSetup: function (requestOptions, next) {
          /*
           requestOptions.headers = {name: value}
           requestOptions.method = '' (GET, POST, ...)
           requestOptions.httpVersion = '' (1.0, 1.1)
           requestOptions.protocol = '' (http:, https:)
           requestOptions.hostname = '' (host.com)
           requestOptions.port = '' (80, 443, ...)
           requestOptions.path = '' (/p/a/t/h?query=string)
          */

          // Call next to proceed
          next()
        },
        onRequest: function (proxyRequest, next) {
          // proxyRequest = http.ClientRequest (See nodejs documentation for more info)
          // Call next to proceed
          next()
        },
        requestPipe: function (proxyRequest) {
          // proxyRequest = http.ClientRequest (See nodejs documentation for more info)
          // Return a nodejs transform stream. A handy way to create transform streams
          // is to use the module through2. 
          return TransformStream
        },
        onResponse: function (proxyResponse, next) {
          // proxyResponse = http.IncomingMessage (See nodejs documentation for more info)
          // Call next to proceed
          next()
        },
        responsePipe: function (proxyResponse) {
          /*
          proxyResponse = http.IncomingMessage (See nodejs documentation for more info)
          Return a nodejs transform stream. A handy way to create transform streams
          is to use the module through2. 
          */
          return TranformStream
        }
    }

For more information see the examples folder.

# TLS Proxying

Read more about tls proxying [ here](https://github.com/niklasi/halland-proxy/blob/master/tls.md).

# Contribute

Every contribution in form of code, feature requests, bug reports, documentation etc is greatly appreciated.

## Step 1: Fork

Fork the project and clone your copy.

        $ git clone git@github.com:username/halland-proxy.git
        $ cd halland-proxy
        $ git remote add upstream git://github.com/niklasi/halland-proxy.git

## Step 2: Branch

Create a branch and start coding

        $ git checkout -b my-branch -t origin/master

## Step 3: Commit

Commit your work to your fork

## Step 4: Rebase

Use git rebase (not git merge) to sync your work from time to time.

        $ git fetch upstream
        $ git rebase upstream/master

# TODO

- [x] TLS
- [ ] Websockets
- [ ] UI-plugins
- [ ] Documentation
- [ ] Make an icon (help needed)
- [ ] A lot of other stuff...

# License

ISC (see LICENSE file)

Read more about ISC here: http://choosealicense.com/licenses/isc
