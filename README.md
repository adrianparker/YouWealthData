# YouWealthData

## Project status
Work in progress. As at July 2019 this program does nothing.

## BNZ API Key
You will need your own BNZ Fund Unit Prices API Key to use this application. As at July 2019, I use the API Key that BNZ make available in the public source of their website. (Visit https://www.bnz.co.nz and view source)

## Installation
Ensure you have node installed. (v10.16.0 is the version app is developed against, but anything modern should be fine). Clone the repo to a local directory. Change into that directory. Use npm to install the application.

```
cd YouWealthData
npm install
```

## Usage
Use this application to download a .csv file of BNZ YouWealth unit prices. For this you will need to supply the BNZ API key to use, as well as a path to the .csv file you would like to generate. For example:

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