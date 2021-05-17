#!/usr/bin/env node
/* eslint-disable no-unused-vars */
var argv = require('argv')
var UnitPriceFetcher = require('./unitPriceFetcher')
var UnitPriceParser = require('./unitPriceParser')

var apiKey
var filename
var unitPricesByDate = {}
const oneDayInMilliseconds = 86400000

function start() {
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
    argv.help()
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

function retrieveYouWealthUnitPrices() {
  const inceptionDate = new Date('2018-05-21')
  var msSinceInception = inceptionDate.valueOf()
  while (msSinceInception < Date.now()) {
    // get unit prices for msSinceInception
    var thisDate = new Date(msSinceInception)
    var thisDateString = thisDate.toISOString().split('T')[0]
    if (thisDate.getDay() === 0 || thisDate.getDay() === 6) {
      // skip weekends as no unit prices on weekends
      console.log('Skipping ' + thisDateString)
    } else {
      console.log('Get unit prices for ' + thisDateString)
      // store in unitPricesByDate under propertyName of yyyy-mm-dd
      // increment msSinceInception by one day
    }
    msSinceInception += oneDayInMilliseconds
  }
}

start()
