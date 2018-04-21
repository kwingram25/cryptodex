require('shelljs/global');
const Color = require('color');

const DataURI = require('datauri').promise;
const coinsJson = require('../app/constants/coins/data.json');
const getManifest = require('../chrome/manifest');
const fs = require('fs');
const css = require('./css');

// console.log(coinsJson);

const coins = Object.values(coinsJson);
//const datauri = new DataURI();

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

exports.copyAssets = (type) => {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);

  const manifest = getManifest(env);
  console.log(manifest);
  fs.writeFile(`${type}/manifest.json`, JSON.stringify(manifest, null, '\t'), 'utf8', () => {});

  // cp(`chrome/manifest.${env}.json`, `${type}/manifest.json`);
  cp('-R', 'chrome/assets/*', type);
  exec(`pug -O "{ env: '${env}' }" -o ${type} chrome/views/`);
};

exports.writeCoinScss = () => {
  const path = 'app/static/styles/coins.css';

  //if (!fs.existsSync(path)) {
  //if (!fs.existsSync(path)) {
    let string = '';

    Object.values(coins).forEach(({ code, color, char }) => {
      const main = Color(color);
      const colors = {
        main: main.hex(),
        light: main.lighten(0.15).hex(),
        dark: main.darken(0.15).hex()
      };
      string += `
      ${css.borderRight(code, colors.main)}
      ${css.textColor(code, colors.light)}
      ${css.backgroundColor('backgroundColor')(
        code,
        colors.main
      )}
      ${css.backgroundColor('backgroundColorHover')(
        code,
        colors.main
      )}
      ${css.backgroundColor('backgroundColorHover', ':hover')(
        code,
        colors.dark
      )}
      ${css.backgroundColor('backgroundColorAfter', ':after')(
        code,
        colors.main
      )}
      ${css.coinLogoAfter(code, `\\${char}`)}
    `;
    // string += `${coin.code}: (
    //     color: ${color.string()},
    //     colorLight: ${color.lighten(0.15).string()},
    //     colorDark: ${color.darken(0.15).string()},
    //     char: '\\${coin.char}'
    //   ),
    //   `;
    });

    fs.writeFile(path, string, 'utf8', () => {});
  //}
  //}
};

exports.writeIconsToFile = () => {
  const path = 'app/constants/coins/svg.json';
  //if (!fs.existsSync(path)) {
    Promise.all(
      coins.map(coin =>
        DataURI(`app/static/img/icons/${coin.ticker}.svg`)
      )
    ).then((array) => {
      const res = {};
      array.forEach((data, index) => {
        res[coins[index].code] = data;
      });

      fs.writeFile(path, JSON.stringify(res), 'utf8', () => {});
    });
  //}
};
