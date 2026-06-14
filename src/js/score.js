export class Score {
  // Constructor: initialiseert score manager, UI element en positie
  constructor(initialScore = 0) {
    this.score = initialScore
    this.createUI()
    this.updateText()
    this.updatePosition()
    window.addEventListener('resize', () => this.updatePosition())
  }

  // createUI: maakt het score DOM-element en voegt het toe aan de pagina
  createUI() {
    this.el = document.createElement('div')
    this.el.id = 'score'
    this.el.style = 'position: absolute; top: 12px; left: 12px; color: white; font-family: sans-serif; font-size: 20px; z-index: 1000; text-shadow: 0 0 6px #000; pointer-events: none;'
    document.body.appendChild(this.el)
  }

  // updateText: werkt de weergegeven score tekst bij
  updateText() {
    if (!this.el) return
    this.el.innerText = `Score: ${this.score}`
  }

  // updatePosition: plaatst de score UI netjes ten opzichte van het canvas
  updatePosition() {
    if (!this.el) return
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    this.el.style.left = `${Math.max(12, rect.left + 12)}px`
    this.el.style.top = `${Math.max(12, rect.top + 12)}px`
  }

  // add: verhoogt de score en werkt de UI bij
  add(value = 1) {
    this.score += value
    this.updateText()
  }

  // reset: zet de score terug naar 0 en update UI
  reset() {
    this.score = 0
    this.updateText()
  }
}
