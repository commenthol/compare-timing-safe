# compare-timing-safe

> String comparison in length constant time

Works in node and in the browser.

Node version uses `crypto` module.

### `timingSafeEqual(a, b)`

String, buffer comparison in length-constant time

**Example**

```js
const timingSafeEqual = require('compare-timing-safe')
const input = 'a'
const compareWith = 'bbbbbbbb'
timingSafeEqual(input, compareWith)
//> false
```

**Parameters**

| parameter | type           | description                          |
| --------- | -------------- | ------------------------------------ |
| `a`       | String, Buffer | String or buffer from input          |
| `b`       | String, Buffer | String or buffer to compare with `a` |

**Returns** `Boolean`, true if strings match

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install compare-timing-safe
```

## Tests

```sh
$ npm test
$ npm run zuul
```

## License

Unlicense <https://unlicense.org>

## References

- [A lesson in timing attacks](https://codahale.com/a-lesson-in-timing-attacks/)
