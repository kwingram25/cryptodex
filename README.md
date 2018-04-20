![](https://i.imgur.com/gugkLkg.png)
> All-in-one cryptocurrency address book for Google Chrome

* [Official Site](https://cryptodex.rocks)
* [Chrome Webstore](https://chrome.google.com/webstore/detail/cryptodex/pbfbaeobcojdjfgplolbofdjlahhclkc)

## Installation

```bash
$ git clone https://github.com/kwingram25/cryptodex.git
$ npm install
```

## Development
* Run script
```bash
# build files to './dev'
# start webpack development server
$ npm run dev
```
* [Load unpacked extensions](https://developer.chrome.com/extensions/getstarted#unpacked) with `./dev` folder

## Build

```bash
# build files to './build'
$ npm run build
```

## Compress

```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

## Test
```bash
# lint
$ npm run lint
# test/app
$ npm test
$ npm test -- --watch  # watch files
# test/e2e
$ npm run dev
$ npm run test-e2e
```

## Acknowledgments
* Based on [React Chrome Extension Boilerplate](https://github.com/jhen0409/react-chrome-extension-boilerplate)
* [Material UI](https://material-ui-next.com)
* [Redux ORM](https://github.com/tommikaikkonen/redux-orm)
* [Cryptocoins](https://github.com/allienworks/cryptocoins/issues/63)

## License
[MIT](LICENSE)
