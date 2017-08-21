/* global describe, it */

const expect = require('chai').expect
const assert = require('stream-assert')
const File = require('vinyl')
const fs = require('fs')
const path = require('path')

const elmCss = require('../')

const fixture = function(glob) {
  return path.join(__dirname, 'fixture', 'src', glob)
}

describe('gulp-elm-css', function() {
  var stream

  beforeEach(function() {
    stream = elmCss({ root: path.join(__dirname, 'fixture') })
  })

  it('should work in buffer mode', function(done) {
    this.timeout(6000000)

    function assertContents(index, file) {
      const filePath = path.join(__dirname, 'fixture', 'dist', file)

      return assert.nth(index, function(dep) {
        expect(dep.contents).to.eql(fs.readFileSync(filePath))
      })
    }

    stream
      .pipe(assertContents(0, '1.css'))
      .pipe(assertContents(1, '2.css'))
      .pipe(assertContents(2, '3.css'))
      .pipe(assert.end(done))
    stream.write(
      new File({
        path: fixture('Stylesheets.elm'),
        contents: fs.readFileSync(fixture('Stylesheets.elm')),
      })
    )
    stream.end()
  })

  it('should emit error on streamed file', done => {
    stream
      .once('error', function(err) {
        expect(err.message).to.eql('gulp-elm-css: Streaming not supported')
      })
      .pipe(assert.end(done))
    stream.write({
      isNull: function() {
        return false
      },
      isStream: function() {
        return true
      },
    })
    stream.end()
  })

  it('should emit error if elm-css fails', done => {
    this.timeout(6000000)

    stream
      .once('error', function(err) {
        expect(err.message).to.equal(
          'gulp-elm-css: elm-css Errored with exit code 1'
        )
      })
      .pipe(assert.end(done))
    stream.write(
      new File({
        path: fixture('Stylesheets2.elm'),
        contents: Buffer(''),
      })
    )
    stream.end()
  })

  it('should ignore null files', function(done) {
    stream.pipe(assert.length(0)).pipe(assert.end(done))
    stream.write(new File())
    stream.end()
  })
})
