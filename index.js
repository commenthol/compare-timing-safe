const crypto = require('crypto')

/**
* string, buffer comparison in length-constant time
* uses crypto module
* @see https://codahale.com/a-lesson-in-timing-attacks/
*
* @param {String|Buffer} a - string or buffer from input
* @param {String|Buffer} b - string or buffer to compare with `a`
* @return {Boolean} true if strings match
* @example
* const timingSafeEqual = require('compare-timing-safe')
* const input = 'a'
* const compareWith = 'bbbbbbbb'
* timingSafeEqual(input, compareWith)
* //> false
*/
function timingSafeEqual (a, b) {
  const key = crypto.randomBytes(32)
  const toHmac = (str) => crypto.createHmac('sha256', key).update(str).digest()
  return crypto.timingSafeEqual(toHmac(a), toHmac(b))
}

module.exports = timingSafeEqual
