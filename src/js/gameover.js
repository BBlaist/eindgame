export class GameOver {
  // Constructor: maakt het fullscreen game-over overlay met key handler
  constructor() {
    this.overlay = document.createElement('div')
    this.overlay.id = 'game-over-screen'
    this.overlay.style = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(10, 10, 15, 0.85);
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      color: #ff007f; font-family: sans-serif;
      z-index: 999; text-shadow: 0 0 10px #ff007f;
    `

    this.overlay.innerHTML = ''

    this.keyHandler = (e) => {
      if (!e.key) return
      if (e.key.toLowerCase() === 'r') {
        this.hide()
        window.location.reload()
      }
    }
  }

  // show: toont overlay, slaat highscore op per modus en luistert naar R om te herstarten
  show(finalScore = 0, mode = 'normal') {
    const key = `eindgame_highscore_${mode}`
    const prev = parseInt(localStorage.getItem(key) || '0', 10)
    const high = Math.max(prev, finalScore)
    localStorage.setItem(key, String(high))

    this.overlay.innerHTML = `
      <h1 style="font-size: 4rem; margin-bottom: 10px; letter-spacing: 4px;">GAME OVER</h1>
      <p style="color: #00f0ff; font-size: 1.5rem; text-shadow: 0 0 8px #00f0ff;">Your score: ${finalScore}</p>
      <p style="color: #00ff9e; font-size: 1.2rem; text-shadow: 0 0 6px #00ff9e;">Highscore: ${high}</p>
      <p style="color: #ffffff; font-size: 1rem; margin-top: 8px;">Press [R] to Try Again</p>
    `

    if (!this.overlay.parentNode) document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.keyHandler)
  }

  // hide: verwijdert overlay en key listener
  hide() {
    if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay)
    document.removeEventListener('keydown', this.keyHandler)
  }
}
