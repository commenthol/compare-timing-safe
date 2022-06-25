import assert from 'assert'

import timingSafeEqual from '../index.js'
import timingSafeEqualBrowser from '../browser.js'

const STR = '\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u{1F47B}'

describe('compare-timeing-safe', function () {
  ;[
    ['timingSafeEqual (node)', timingSafeEqual, 1],
    ['timingSafeEqual (browser)', timingSafeEqualBrowser, 0]
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

        it('buffer like', function () {
          const a = stringToUtf8Array(STR)
          assert.ok(timingSafeEqual(a, a))
        })
      })

      describe('bad case', function () {
        const tests = [
          ['length a > b', STR, STR.slice(0, 35)],
          ['length a < b', STR.slice(0, 35), STR],
          ['same length', STR, STR.replace(/A/, 'B')],
          ['undefined args', undefined, undefined],
          ['a undefined', undefined, STR],
          ['b undefined', STR, undefined]
        ]
        tests.forEach(([name, a, b]) => {
          it(name, function () {
            assert.ok(!timingSafeEqual(a, b))
          })
        })
      })

      describe('timing tests', function () {
        const LOOPS = 10000
        const cache = {}

        // common non timing safe string comparison
        function loop (a, b, i) {
          let r = 0
          const start = Date.now()
          while (i--) {
            r |= (b === a)
          }
          r = 0 // prevents eslint no unused vars
          return Date.now() - start + r
        }

        // our timing safe string comparison
        function loopSafe (a, b, i) {
          let r = 0
          const start = Date.now()
          while (i--) {
            r |= timingSafeEqual(a, b)
          }
          r = 0 // prevents eslint no unused vars
          return Date.now() - start + r
        }

        it('comparing same length', function () {
          const t1 = loop(STR, STR, LOOPS)
          const t2 = loopSafe(STR, STR, LOOPS)
          assert.ok(t1 < t2)
          cache.t2 = t2 // make sure that tests require same time
        })

        it('comparing with one char', function () {
          const t1 = loop(STR.charAt(0), STR, LOOPS)
          const t2 = loopSafe(STR.charAt(0), STR, LOOPS)
          assert.ok(t1 < t2)
          assert.strictEqual(logFloor(t2), logFloor(cache.t2))
        })

        it('comparing with double length', function () {
          const t1 = loop(STR + STR, STR, LOOPS)
          const t2 = loopSafe(STR + STR, STR, LOOPS)
          assert.ok(t1 < t2)
          assert.strictEqual(logFloor(t2), logFloor(cache.t2))
        })
      })
    })
  })
})

function logFloor (val) {
  return Math.floor(Math.log(val))
}

function stringToUtf8Array (str) {
  const sUtf8 = unescape(encodeURIComponent(str))
  return stringToUint8Array(sUtf8)
}

function stringToUint8Array (str) {
  const array = new Uint8Array(str.length)
  for (let i = 0; i < array.length; i++) {
    array[i] = str.charCodeAt(i)
  }
  return array
}
