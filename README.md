# YouWealthData

BNZ offer a set of diversified retail managed funds collectively known as [YouWealth](https://www.bnz.co.nz/personal-banking/investments/youwealth). 

The manager of these funds recently became part of [Firstcape Group](https://www.firstcape.co.nz/). 

Please note this project "YouWealthData" is not endorsed by nor supported by either BNZ or Firstcape.

YouWealthData is a simple utility that downloads daily unit prices for all YouWealth funds into a local CSV file, suitable for use in Excel. 

The file contains, for each weekday since fund pricing began, the relevant fund's buy unit price, sell unit price, and adds a calculated mid price to aid analysis. 

## Data set changes
BNZ [closed the "Balanced Growth" fund February 2024](https://blog.bnz.co.nz/2023/11/youwealth-balanced-growth-fund-amalgamation). The API no longer provides prices for this fund so prices are not available in the generated CSV.

BNZ recently [added a new "High Growth" fund](https://blog.bnz.co.nz/2023/11/bnz-expands-investment-offering-by-launching-high-growth-funds-for-the-bnz-kiwisaver-scheme-and-youwealth), and unit prices for this fund are available starting 28 November 2023.

## Project status
Complete, functional, ready to use.

## BNZ API Key
You will need access to a BNZ Fund Unit Prices API Key to use this application. 
BNZ make a key publicly available in the source of https://www.bnz.co.nz - look at the value assigned to 'apiKey' of window.__bootstrap in a script tag.

## Installation
Ensure you have node installed. (Any modern version should be fine). 
Clone the repo to a local directory. Change into that directory. Use npm to install the application.

```
cd YouWealthData
npm install
```

## Usage
Use this application to create a local .csv file of BNZ YouWealth unit prices. 
You will need to supply the BNZ API key to use, as well as a path to the .csv file you would like to generate. 
For example:

```
cd YouWealthData
./YouWealthData.js -k APIKEY -f /path/to/generated.csv
```

## Tests

To execute tests you will need to pass the BNZ API key to use, via parameter --api_key.
For example:

```
npm test -- --api_key=APIKEY
```

Or you can pass --api_key=APIKEY to Mocha as an argument.

## Contributing
Fire in a pull request by all means. Please adhere to Javascript Standard Style: https://standardjs.com/rules.html

## Disclosure & Disclaimer
This project is not endorsed nor supported in any way by BNZ nor Firstcape. You should not rely on the fitness nor accuracy of anything related to this project, for any purpose. Caveat emptor.