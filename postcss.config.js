module.exports = {
  // plugins: {
  //   autoprefixer: {}
  // }
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      unitPrecision: 6,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 750
    },
    'postcss-design-convert': {
      multiple: 2,
      units: ['vw'],
      selector: /\.van-/
    }
  }
}
