#!/usr/bin/env node
var argv = require('argv')
var UnitPriceFetcher = require('./unitPriceFetcher')
var UnitPriceParser = require('./unitPriceParser')

var apiKey
var filename

function start () {
  var pjson = require('./package.json')
  var args
  console.log('YouWealthData v ' + pjson.version)
  argv.version(pjson.version)
  argv.option({
    name: 'api_key',
    short: 'k',
    type: 'string',
    description: 'BNZ API Key',
    example: "'YouWealthData --api_key=FOO' or 'YouWealthData -k BAR'"
  })
  argv.option({
    name: 'filename',
    short: 'f',
    type: 'path',
    description: 'Path of .csv file',
    example: "'YouWealthData --filename=FOO' or 'YouWealthData -f BAR'"
  })
  args = argv.run()
  if (Object.getOwnPropertyNames(args.options).length === 0) {
    console.log('No command line options supplied.')
    process.exit(1)
  } else if ((Object.getOwnPropertyNames(args.options).length !== 2) ||
    (args.options.filename === null) ||
    (args.options.api_key === null)) {
    console.log('Please provide all command line options.')
    argv.help()
    process.exit(1)
  } else {
    apiKey = args.options.api_key
    filename = args.options.filename
    retrieveYouWealthUnitPrices()
  }
}

function retrieveYouWealthUnitPrices () {

}

start()