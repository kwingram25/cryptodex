const path = require('path');
const webpack = require('webpack');
const postCSSConfig = require('./postcss.config');

//const customPath = path.join(__dirname, './customPublicPath');

const files = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'ttf', 'woff', 'woff2'];

module.exports = {
  entry: {
    app: [path.join(__dirname, '../chrome/extension/app')],
    background: [path.join(__dirname, '../chrome/extension/background')],
    inject: [path.join(__dirname, '../chrome/extension/inject/index')]
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  postcss() {
    return postCSSConfig;
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    root: [
      path.resolve('./app')
    ],
    extensions: files.map(extension => (`.${extension}`)).concat(['', '.jsx', '.js'])
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react-optimize']
      }
    }, {
      test: new RegExp(`\.(${files.join('|')})$`),
      loader: 'url-loader',
      options: {
        limit: 100000,
      },
      exclude: /node_modules\/!(typeface-roboto)/
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ],
      exclude: /node_modules\/!(typeface-roboto)/
    }, {
      test: /\.scss$/,
      loaders: [
        'style',
        'css',
        'sass',
      ],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.svg((\?.*)?|$)/,
      loaders: [
        'svg-url-loader', // or url-loader
      ]
    }, {
      test: /node_modules\/datauri\/index\.js$/,
      loaders: ['shebang', 'babel']
    }]
  }
};
