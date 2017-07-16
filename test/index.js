/* global describe, it */

const assert = require('assert')

const STR = '\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

describe('#equal-timeing-safe', function () {
  ;[
    ['timingSafeEqual', require('..'), 1],
    ['timingSafeEqual (browser)', require('../browser.js'), 0]
  ].forEach(([name, timingSafeEqual, hasBuffer]) => {
    describe(name, function () {
      describe('good case', function () {
        it('string', function () {
          const a = STR
          assert.ok(timingSafeEqual(a, a))
        })

        if (hasBuffer && typeof window === 'undefined') {
          it('buffer', function () {
            const a = Buffer.from(STR)
            assert.ok(timingSafeEqual(a, a))
          })
        }
      })

      describe('bad case', function () {
        const tests = [
          ['length a > b', STR, STR.substr(0, 35)],
          ['length a < b', STR.substr(0, 35), STR],
          ['same length', STR, STR.replace(/A/, 'B')]
        ]
        tests.forEach(([name, a, b]) => {
          it(name, function () {
            assert.ok(!timingSafeEqual(a, b))
          })
        })
      })

      describe('timing tests', function () {
        const loops = 10000
        const test = {}

        // common non timeing safe string comparison
        function loop (a, b, i) {
          let r
          const start = Date.now()
          while (i--) {
            r |= (b === a)
          }
          r = 0
          return Date.now() - start + r
        }

        // our timeing safe string comparison
        function loopSafe (a, b, i) {
          let r // e slint-disable-line
          const start = Date.now()
          while (i--) {
            r |= timingSafeEqual(a, b)
          }
          r = 0
          return Date.now() - start + r
        }

        it('comparing same length', function () {
          const t1 = loop(STR, STR, loops)
          const t2 = loopSafe(STR, STR, loops)
          assert.ok(t1 < t2)
          test.t2 = t2 // make sure that tests require same time
        })

        it('comparing with one char', function () {
          const t1 = loop(STR.charAt(0), STR, loops)
          const t2 = loopSafe(STR.charAt(0), STR, loops)
          assert.ok(t1 < t2)
          assert.ok(logFloor(t2), logFloor(test.t2))
        })

        it('comparing with double length', function () {
          const t1 = loop(STR + STR, STR, loops)
          const t2 = loopSafe(STR + STR, STR, loops)
          assert.ok(t1 < t2)
          assert.ok(logFloor(t2), logFloor(test.t2))
        })
      })
    })
  })
})

function logFloor (val) {
  return Math.floor(Math.log(val))
}
