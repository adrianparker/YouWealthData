#!/usr/bin/env node
const argv = require('argv')
const UnitPriceFetcher = require('./unitPriceFetcher')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const oneDayInMilliseconds = 86400000

let apiKey
let filename

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
    console.log('Please provide only api_key and filename command line options.')
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
  let msSinceInception = inceptionDate.valueOf()
  let priceDates = []
  while (msSinceInception < Date.now()) {
    // get unit prices for msSinceInception
    let thisDate = new Date(msSinceInception)
    let thisDateString = thisDate.toISOString().split('T')[0]
    if (thisDate.getDay() !== 0 && thisDate.getDay() !== 6) {
      priceDates.push(thisDateString)
    }
    // TODO this is a temporary handbrake to avoid smashing the API
    if (priceDates.length >= 2) {
      msSinceInception = Date.now()
    } else {
      // increment msSinceInception by one day
      msSinceInception += oneDayInMilliseconds
    }
  }
  if (priceDates.length > 0) {
    console.log('Processing for', priceDates.length, 'unit price dates')
    UnitPriceFetcher.getUnitPricesForDates(apiKey, priceDates.reverse(), writeUnitPriceCSV)
  }
}

function writeUnitPriceCSV(fundPricesForDates) {
  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      { id: 'pricedate', title: 'DATE' },
      { id: 'BNZ2112011-buy', title: 'BNZ2112011 Buy' },
      { id: 'BNZ2112011-sell', title: 'BNZ2112011 Sell' },
      { id: 'BNZ2112010-buy', title: 'BNZ2112010 Buy' },
      { id: 'BNZ2112010-sell', title: 'BNZ2112010 Sell' },
      { id: 'BNZ2112007-buy', title: 'BNZ2112007 Buy' },
      { id: 'BNZ2112007-sell', title: 'BNZ2112007 Sell' },
      { id: 'BNZ2112009-buy', title: 'BNZ2112009 Buy' },
      { id: 'BNZ2112009-sell', title: 'BNZ2112009 Sell' },
      { id: 'BNZ2112008-buy', title: 'BNZ2112008 Buy' },
      { id: 'BNZ2112008-sell', title: 'BNZ2112008 Sell' }
    ]
  })
  const records = []
  Object.keys(fundPricesForDates).forEach(function (date, index) {
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

start()
