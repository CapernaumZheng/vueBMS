'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://result.eolinker.com/kbLFLCHb0a6b4e30321ab498773749358de36682b726645?uri="',
})
