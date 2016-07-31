var webpack = require("webpack");

// returns a Compiler instance
webpack({
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 's-flux.common.js'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: "babel",
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: [
    {'es6-promise': true}
  ],
  target: 'node'
}, function(err, stats) {
  if (err)
    return handleFatalError(err);
  var jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0)
    console.log(jsonStats.errors)
  if (jsonStats.warnings.length > 0)
    handleWarnings(jsonStats.warnings);
});
