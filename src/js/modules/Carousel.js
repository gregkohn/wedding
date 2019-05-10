import hammer from 'hammerjs'

export default class Carousel {
  constructor(el) {
    this.el = el
    this.setVars()
    this.populateIndicators()
    this.bindEvents()
    this.setupTabMaps()
  }

  setVars() {
    this.slider = this.el.querySelector('.carousel-slider')
    this.slides = [...this.el.querySelectorAll('.carousel-slide')]
    this.arrows = [...this.el.querySelectorAll('.carousel-arrow')]
    this.indicatorsContainer = this.el.querySelector('.carousel-indicators')
    this.indicators = []

    this.currentSlide = 0
    this.activeClass = '-is-active'
  }

  bindEvents() {
    this.arrows.forEach(arrow => {
      const dir = arrow.getAttribute('data-dir')
      arrow.addEventListener('click', () => this.handleSlide(dir))
    })

    this.mc = new hammer(this.el)
    this.mc.on('swipeleft', () => this.handleSlide('right'))
    this.mc.on('swiperight', () => this.handleSlide('left'))
  }

  handleSlide(dir) {
    // Disable tabbing on outgoing slide
    this.disableTabbing(this.currentSlide)

    const oldSlide = this.currentSlide
    switch (dir) {
      case 'left':
        this.currentSlide--
        break
      case 'right':
        this.currentSlide++
        break
    }

    // Boundaries for swiping events
    if (this.currentSlide < 0) {
      this.currentSlide = 0
    } else if (this.currentSlide === this.slides.length) {
      this.currentSlide = this.slides.length - 1
    }

    // Enable tabbing on incoming slide
    this.enableTabbing(this.currentSlide)

    if (oldSlide !== this.currentSlide) {
      // Update mobile indicator
      this.indicators[oldSlide].classList.remove(this.activeClass)
      this.slideTo(this.currentSlide)
    }
  }

  slideTo(num) {
    const position = `${-100 * num}%`
    this.slider.style.transform = `translate3d(${position}, 0, 0)`

    // Handle arrows
    if (this.currentSlide === 0) {
      // Left boundary
      this.disableArrow(0)
      this.enableArrow(1)
    } else if (this.currentSlide === this.slides.length - 1) {
      // Right boundary
      this.disableArrow(1)
      this.enableArrow(0)
    } else {
      // Make sure everything is enabled
      this.enableArrow(0)
      this.enableArrow(1)
    }

    // Handle indicator
    this.indicators[num].classList.add(this.activeClass)
  }

  disableArrow(idx) {
    this.arrows[idx].setAttribute('disabled', 'disabled')
  }

  enableArrow(idx) {
    this.arrows[idx].removeAttribute('disabled')
  }

  setupTabMaps() {
    this.tabMaps = this.slides.map(slide => {
      const tabbableTags = ['a', 'button']
      let tabbableElements = []
      tabbableTags.forEach(tag => {
        tabbableElements = [...tabbableElements, ...slide.querySelectorAll(tag)]
      })
      return tabbableElements
    })

    // Initially, disable tabbing on all slides except the first
    this.slides.slice(1).forEach((slide, idx) => this.disableTabbing(idx + 1))
  }

  disableTabbing(idx) {
    this.tabMaps[idx].forEach(el => el.setAttribute('tabindex', '-1'))

    // ARIA-hide it as well
    this.slides[idx].setAttribute('aria-hidden', 'true')
  }

  enableTabbing(idx) {
    this.tabMaps[idx].forEach(el => el.removeAttribute('tabindex'))

    // Reveal to ARIA as well
    this.slides[idx].removeAttribute('aria-hidden')
  }

  populateIndicators() {
    this.indicatorsContainer.innerHTML = ''

    // Create an indicator for each slide
    this.slides.forEach((_, i) => {
      const indicator = document.createElement('div')
      indicator.classList.add('carousel-indicator')

      // Activate first indicator
      if (i === 0) {
        indicator.classList.add(this.activeClass)
      }

      // Add to DOM
      this.indicatorsContainer.appendChild(indicator)

      // and push reference to array
      this.indicators.push(indicator)
    })
  }
}
