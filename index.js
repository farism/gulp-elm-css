const elmCss = require('elm-css')
const fs = require('fs')
const File = require('vinyl')
const glob = require('glob-promise')
const through = require('through2')
const tmp = require('tmp')
const path = require('path')

const PLUGIN = 'gulp-elm-css'

const defaults = {
  cwd: process.cwd(),
  module: 'Stylesheets',
  out: null,
  port: 'files',
}

module.exports = function(options) {
  const transform = function(file, encode, callback) {
    if (file.isNull()) {
      return callback()
    }

    if (file.isStream()) {
      this.emit('error', new Error('gulp-elm-css: Streaming not supported'))
      return callback()
    }

    const opts = Object.assign({}, defaults, options)
    const tmpDir = tmp.dirSync({ unsafeCleanup: true })
    const dir = opts.out || tmpDir.name
    const _this = this

    elmCss(opts.cwd, file.path, dir, opts.module, opts.port)
      .then(function() {
        return glob(`${dir}/*.css`)
      })
      .then(function(files) {
        Promise.all(
          files.map(function(file) {
            return new Promise(function(resolve, reject) {
              return fs.readFile(file, function(err, contents) {
                if (err) {
                  reject(err)
                } else {
                  _this.push(
                    new File({
                      cwd: process.cwd(),
                      path: path.basename(file),
                      contents,
                    })
                  )
                  tmpDir.removeCallback()
                  resolve()
                }
              })
            })
          })
        ).then(function() {
          tmpDir.removeCallback()
          callback()
        })
      })
      .catch(function(e) {
        tmpDir.removeCallback()
        _this.emit('error', new Error('gulp-elm-css: elm-css ' + e.message))
        callback()
      })
  }

  return through.obj(transform)
}
