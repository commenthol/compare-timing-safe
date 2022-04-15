export default [
  {
    input: 'index.js',
    output: [
      {
        file: './lib/index.cjs',
        format: 'cjs',
        exports: 'named',
        footer: 'module.exports = exports["default"];'
      }],
    plugins: []
  }
]
