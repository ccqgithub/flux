var fs = require('fs')
var zlib = require('zlib')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var version = process.env.VERSION || require('../package.json').version

var banner = '/*!\n' +
' * s-flux.js v' + version + '\n' + ' * (c) ' + new Date().getFullYear() + ' Season Chen\n' + ' * Released under the MIT License.\n' + ' */'

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [babel({loose: 'all'})],
}).then(function(bundle) {
  return write('dist/s-flux.common.js', bundle.generate({format: 'cjs', banner: banner,}).code)
}).then(function() {
  // Standalone Dev Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({'process.env.NODE_ENV': "'development'"}),
      babel({loose: 'all'}),
    ],
  }).then(function(bundle) {
    return write('dist/s-flux.js', bundle.generate({format: 'umd', banner: banner, moduleName: 'sFlux',}).code)
  })
}).then(function() {
  // Standalone Production Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({'process.env.NODE_ENV': "'production'"}),
      babel({loose: 'all'}),
    ],
  }).then(function(bundle) {
    var code = bundle.generate({format: 'umd', moduleName: 'sFlux',}).code
    var minified = banner + '\n' + uglify.minify(code, {
      fromString: true,
      output: {
        ascii_only: true
      },
    }).code
    return write('dist/s-flux.min.js', minified)
  }).then(zip)
}).catch(logError);

function write(dest, code) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(dest, code, function(err) {
      if (err)
        return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip() {
  return new Promise(function(resolve, reject) {
    fs.readFile('dist/s-flux.min.js', function(err, buf) {
      if (err)
        return reject(err)
      zlib.gzip(buf, function(err, buf) {
        if (err)
          return reject(err)
        write('dist/s-flux.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
