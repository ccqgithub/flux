var webpack = require("webpack");

// returns a Compiler instance
webpack({
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 's-flux.min.js',
    library: 'SFlux',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel",
      query: {
        presets: ['es2015']
      }
    }]
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}, function(err, stats) {
  if (err)
    return handleFatalError(err);
  var jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0)
    console.log(jsonStats.errors)
  if (jsonStats.warnings.length > 0)
    console.log(jsonStats.warnings);
});
