import Slide from './utils/slide'

const defaultConfig = {
  onOpen: null,
  onClose: null,
  onToggle: null
}

export default class Toggle {
  constructor(el, config = defaultConfig) {
    this.el = el
    this.config = config

    this.setVars()
    this.bindEvents()
  }

  setVars() {
    this.toggler = this.el.querySelector('[aria-controls]')
    this.toggleeEl = this.el.querySelector('[data-togglee]') || this.el
    this.toggleeClass = this.toggleeEl.getAttribute('data-togglee')
    this.togglee = this.toggleeClass
      ? new Slide(this.toggleeEl, this.toggleeClass)
      : new Slide(this.toggleeEl)

    this.defaultText = this.toggler.innerHTML
    this.toggledText = this.toggler.getAttribute('data-toggled-text')

    if (this.toggler) {
      this.isOpen = this.toggler.getAttribute('aria-expanded') === 'true'

      if (this.toggledText) {
        this.openText = this.isOpen ? this.defaultText : this.toggledText
        this.closedText = !this.isOpen ? this.defaultText : this.toggledText
      }
    }
  }

  bindEvents() {
    if (this.toggler) {
      this.toggler.addEventListener('click', this.handleToggleClick)
    }
  }

  handleToggleClick = () => {
    this.isOpen = !this.isOpen

    if (this.isOpen) {
      this.open()
    } else {
      this.close()
    }

    this.callback('onToggle')
  }

  close = () => {
    this.togglee.close()
    this.toggler.setAttribute('aria-expanded', 'false')

    if (this.toggledText) {
      this.toggler.innerHTML = this.closedText
    }

    this.callback('onClose')
  }

  open = () => {
    this.togglee.open()
    this.toggler.setAttribute('aria-expanded', 'true')

    if (this.toggledText) {
      this.toggler.innerHTML = this.openText
    }

    this.callback('onOpen')
  }

  callback(prop) {
    typeof this.config[prop] === 'function' && this.config[prop]()
  }
}
