export class Lives {
  // Constructor: initialiseert levens manager, UI en posities
  constructor(initialLives = 3, maxLives = 3) {
    this.lives = initialLives
    this.maxLives = maxLives
    this.createUI()
    this.updateBars()
    this.updatePosition()
    window.addEventListener('resize', () => this.updatePosition())
  }

  // createUI: bouwt de levens-balkjes in de DOM
  createUI() {
    this.container = document.createElement('div')
    this.container.id = 'lives'
    this.container.style = 'position: absolute; top: 36px; left: 12px; z-index: 1000; pointer-events: none; display: flex; gap: 8px; align-items: center;'
    for (let i = 0; i < this.maxLives; i++) {
      const bar = document.createElement('div')
      bar.className = 'life-bar'
      bar.style.width = '60px'
      bar.style.height = '12px'
      bar.style.borderRadius = '4px'
      bar.style.boxShadow = '0 0 6px rgba(0,0,0,0.6)'
      this.container.appendChild(bar)
    }
    document.body.appendChild(this.container)
  }

  // updatePosition: positioneert de levens UI ten opzichte van het canvas
  updatePosition() {
    const canvas = document.querySelector('canvas')
    if (!canvas || !this.container) return
    const rect = canvas.getBoundingClientRect()
    this.container.style.left = `${Math.max(12, rect.left + 12)}px`
    this.container.style.top = `${Math.max(36, rect.top + 36)}px`
  }

  // updateBars: actualiseert kleuren van de balkjes (groen/rood)
  updateBars() {
    if (!this.container) return
    const bars = Array.from(this.container.children)
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = i < this.lives ? 'green' : 'red'
    }
  }

  // lose: verlaag levens met één, update UI en retourneer of spel door kan gaan
  lose() {
    if (this.lives <= 0) {
      return false
    }
    this.lives -= 1
    this.updateBars()
    return this.lives > 0
  }

  // gain: geef een extra leven (tot max) en update UI
  gain() {
    if (this.lives >= this.maxLives) {
      return false
    }
    this.lives += 1
    this.updateBars()
    return true
  }
}
