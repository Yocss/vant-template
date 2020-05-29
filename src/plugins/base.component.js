import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

// const svg = require.context('@/assets/svg', false, /\.svg$/)
// const loadSvg = obj => obj.keys().map(obj)
// loadSvg(svg)

const requireComponent = require.context('@/components/base/', false, /_base-[\w-]+\.vue$/)

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\/_/, '').replace(/\.\w+$/, '')))
  // register global components
  Vue.component(componentName, componentConfig.default || componentConfig)
})
