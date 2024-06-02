# YouWealthData

## Data set changes
BNZ [closed their "Balanced Growth" fund February 2024](https://blog.bnz.co.nz/2023/11/youwealth-balanced-growth-fund-amalgamation). Their API no longer provides any prices for this fund.

BNZ [added a new "High Growth" fund option](https://blog.bnz.co.nz/2023/11/bnz-expands-investment-offering-by-launching-high-growth-funds-for-the-bnz-kiwisaver-scheme-and-youwealth), 28 November 2023.

## Project status
Complete, ready to use.

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

### Disclosure & Disclaimer
This project is not endorsed nor supported in any way by Bank of New Zealand. You should not rely on the fitness nor accuracy of anything related to this project, for any purpose. Caveat emptor and all that.