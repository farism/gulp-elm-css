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

const fixtureOutput = function(glob) {
  return path.join(__dirname, 'fixture', 'dist', glob)
}

describe('gulp-elm-css', function() {
  var stream

  beforeEach(function() {
    stream = elmCss({cwd: path.join(__dirname, 'fixture')})
  })

  it('should work in buffer mode', function(done) {
    stream
      .pipe(
        assert.nth(0, dep =>
          expect(String(dep.contents)).to.equal(
            String(fs.readFileSync(fixtureOutput('1.css')))
          )
        )
      )
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

  it('should ignore null files', function(done) {
    stream.pipe(assert.length(0)).pipe(assert.end(done))
    stream.write(new File())
    stream.end()
  })
})
