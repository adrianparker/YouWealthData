#!/usr/bin/env node
const argv = require('argv')
const _ = require('lodash')
const UnitPriceFetcher = require('./unitPriceFetcher')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const oneDayInMilliseconds = 86400000
const priceDates = []

let apiKey
let filename
let fundPricesForDates = {}

/**
 * Entry function for the application.
 * Validates program inputs and invokes unit price date calculation if correct;
 * otherwise emits help content and exits.
 */
function start() {
  const pjson = require('./package.json')
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
  let args = argv.run()
  if (Object.getOwnPropertyNames(args.options).length === 0) {
    console.log('No command line options supplied.')
    argv.help()
    process.exit(1)
  } else if ((Object.getOwnPropertyNames(args.options).length !== 2) ||
    (args.options.filename === null) ||
    (args.options.api_key === null)) {
    console.log('Please provide only api_key and filename command line options.')
    argv.help()
    process.exit(1)
  } else {
    apiKey = args.options.api_key
    filename = args.options.filename
    retrieveYouWealthUnitPrices()
  }
}

/**
 * Generates the list of weekdays to retrieve fund prices for.
 * If there are any, invokes the retrieval loop.
 */
function retrieveYouWealthUnitPrices() {
  const inceptionDate = new Date('2018-05-21')
  let msSinceInception = inceptionDate.valueOf()
  while (msSinceInception < Date.now()) {
    // get unit prices for msSinceInception
    let thisDate = new Date(msSinceInception)
    let thisDateString = thisDate.toISOString().split('T')[0]
    if (thisDate.getDay() !== 0 && thisDate.getDay() !== 6) {
      priceDates.push(thisDateString)
    }
    msSinceInception += oneDayInMilliseconds
  }
  if (priceDates.length > 0) {
    console.log('Processing for', priceDates.length, 'unit price dates...')
    retrieveNextBatchOfUnitPrices()
  } else {
    console.log('No unit price dates available')
    process.exit(2)
  }
}

/**
 * Retrieves unit prices in groups of maximum 10 dates at a time to avoid swamping BNZ's API.
 */
function retrieveNextBatchOfUnitPrices() {
  if (priceDates.length > 10) {
    UnitPriceFetcher.getUnitPricesForDates(apiKey, priceDates.splice(0, 10), processNextBatchOfUnitPrices)
  } else {
    UnitPriceFetcher.getUnitPricesForDates(apiKey, priceDates.splice(0, priceDates.length), processNextBatchOfUnitPrices)
  }
}

/**
 * Stores this batch of unit prices for dates, and either requests the next or invokes CSV generation if no dates left to retrieve.
*/
function processNextBatchOfUnitPrices(batchOfFundPrices) {
  console.log('...processing', Object.keys(batchOfFundPrices).length, 'unit price dates;', priceDates.length, 'remaining')
  _.merge(fundPricesForDates, batchOfFundPrices)
  if (priceDates.length > 0) {
    retrieveNextBatchOfUnitPrices()
  } else {
    writeUnitPriceCSV()
  }
}

/**
 * Writes the unit prices for each date to CSV file at file path provided when program was invoked.
 */
function writeUnitPriceCSV() {
  console.log('...writing CSV to ', filename)
  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      { id: 'pricedate', title: 'DATE' },
      { id: 'BNZ2112011-buy', title: 'BNZ2112011 Conservative Buy' },
      { id: 'BNZ2112011-sell', title: 'BNZ2112011 Conservative Sell' },
      { id: 'BNZ2112010-buy', title: 'BNZ2112010 Moderate Buy' },
      { id: 'BNZ2112010-sell', title: 'BNZ2112010 Moderate Sell' },
      { id: 'BNZ2112007-buy', title: 'BNZ2112007 Balanced Buy' },
      { id: 'BNZ2112007-sell', title: 'BNZ2112007 Balanced Sell' },
      { id: 'BNZ2112008-buy', title: 'BNZ2112008 Growth Buy' },
      { id: 'BNZ2112008-sell', title: 'BNZ2112008 Growth Sell' },
      { id: 'BNZ2112012-buy', title: 'BNZ2112012 High Growth Buy' },
      { id: 'BNZ2112012-sell', title: 'BNZ2112012 High Growth Sell' }
    ]
  })
  const records = []
  const keys = Object.keys(fundPricesForDates)
  keys.sort()
  keys.forEach(function (date, index) {
    let pricesForDate = fundPricesForDates[date]
    let thisDateRecord = { 'pricedate': date }
    for (const [key, price] of Object.entries(pricesForDate)) {
      thisDateRecord[key + '-buy'] = price.buyPrice.amount
      thisDateRecord[key + '-sell'] = price.sellPrice.amount
    }
    records.push(thisDateRecord)
  })
  csvWriter.writeRecords(records).then(() => {
    console.log('...Done')
  })
}

// Invoke entry function.
start()
