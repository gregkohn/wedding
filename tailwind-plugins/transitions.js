module.exports = ({ prefix, variants }) => ({ addUtilities, config }) => {
  const className = (key, modifier = '') =>
    'default' === key ? `.${prefix}` : `.${prefix}${modifier}-${key}`

  // Duration
  addUtilities(
    Object.entries(config('transitionDuration')).map(([key, value]) => {
      return {
        [className(key)]: {
          'transition-duration': value
        }
      }
    }),
    variants
  )

  // Property
  addUtilities(
    Object.entries(config('transitionProperty')).map(([key, value]) => {
      return {
        [className(key, '-property')]: {
          'transition-property': value
        }
      }
    }),
    variants
  )

  // Timing Function
  addUtilities(
    Object.entries(config('transitionTimingFunction')).map(([key, value]) => {
      return {
        [className(key, '-timing')]: {
          'transition-timing-function': value
        }
      }
    }),
    variants
  )

  // Delay
  addUtilities(
    Object.entries(config('transitionDelay')).map(([key, value]) => {
      return {
        [className(key, '-delay')]: {
          'transition-delay': value
        }
      }
    }),
    variants
  )
}
