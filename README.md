# Rollup plugin LiveReload

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/thgh/rollup-plugin-livereload/issues">
  <img src="https://img.shields.io/github/issues/thgh/rollup-plugin-livereload.svg" alt="Issues" />
</a>
<a href="http://standardjs.com/">
  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
</a>
<a href="https://npmjs.org/package/rollup-plugin-livereload">
  <img src="https://img.shields.io/npm/v/rollup-plugin-livereload.svg?style=flat-squar" alt="NPM" />
</a>
<a href="https://github.com/thgh/rollup-plugin-livereload/releases">
  <img src="https://img.shields.io/github/release/thgh/rollup-plugin-livereload.svg" alt="Latest Version" />
</a>
  
## Installation
```
npm install --save-dev rollup-plugin-livereload
```

## Usage
```js
// rollup.config.js
import livereload from 'rollup-plugin-livereload'

export default {
  entry: 'entry.js',
  dest: 'bundle.js',
  plugins: [
    livereload()
  ]
}
```

### Options

By default it watches the `dist` folder. Change it by passing a string:
```
livereload('public')

// --- OR ---

livereload({
  watch: 'public',
  // other livereload options
})
```

Options are always passed to [`livereload.createServer()`][livereload]

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Contributions and feedback are very welcome.

To get it running:
  1. Clone the project.
  2. `npm install`
  3. `npm run build`

## Credits

- [Thomas Ghysels](https://github.com/thgh)
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-contributors]: ../../contributors
[livereload]: https://www.npmjs.com/package/livereload
