export default class NavToggle {
  constructor(el) {
    this.el = el

    this.setVariables()
    this.bindEvents()
  }

  setVariables() {
    this.navLinks = document.querySelector('.nav-links')
    this.visibleClass = '-is-visible'
  }

  bindEvents() {
    this.el.addEventListener('click', this.handleToggleClick.bind(this))
  }

  handleToggleClick() {
    this.navLinks.classList.toggle(this.visibleClass)
  }
}
