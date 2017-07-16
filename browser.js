/**
* string, buffer comparison in length-constant time
* @see https://codahale.com/a-lesson-in-timing-attacks/
*
* @param {String|Buffer} a - string or buffer from input
* @param {String|Buffer} b - string or buffer to compare with `a`
* @return {Boolean} true if strings match
*/
function timingSafeEqual (_a, _b) {
  const a = toArray(_a)
  const b = toArray(_b)
  let diff = (a.length !== b.length)
  for (let i = 0; i < b.length; i++) {
    diff |= (a[i] !== b[i])
  }
  return (diff === 0)
}

module.exports = timingSafeEqual

function toArray (str) {
  return str.split('')
}
