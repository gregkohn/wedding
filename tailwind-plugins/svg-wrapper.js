const _ = require('lodash')

module.exports = function({ addUtilities, config }) {
  const fills = config('svgFill', [])
  const fillUtilties = _.map(fills, (fill, name) => {
    return {
      [`.group-fill-${name}`]: {
        svg: {
          fill: fill
        }
      }
    }
  })

  const strokes = config('svgStroke', [])
  const strokeUtilties = _.map(strokes, (stroke, name) => {
    return {
      [`.group-stroke-${name}`]: {
        svg: {
          stroke: stroke
        }
      }
    }
  })

  addUtilities([...fillUtilties, ...strokeUtilties])
}
