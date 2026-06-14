import '../css/style.css'
import { Engine, DisplayMode, SolverStrategy, Vector, Timer, Keys, CollisionType, Scene } from "excalibur"
import { ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Floor } from './floor.js'
import { Background } from './background.js'
import { Obstacle } from './obstacle.js'
import { Powerup } from './powerup.js'
import { Lives } from './lives.js'
import { Score } from './score.js'
import { GameOver } from './gameover.js'

export class Game extends Engine {

    // Constructor: initialiseert de game-engine en globale state
    constructor() {
        super({ 
            width: 1000, 
            height: 600, 
            maxFps: 60, 
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 1000), 
            }
         })
         console.log("hallo dit is mijn game")
         this.showDebug(true)
         this.backgrounds = []
         this.isGameOver = false
         this.gameMode = 'normal'

         // Laad alle resources eerst en zet scenes op
         this.start(ResourceLoader).then(() => {
             class StartScene extends Scene {
                 onInitialize(engine) {
                    console.log('StartScene: druk N voor Normal, S voor Speed of klik een knop')
                    this._container = document.createElement('div')
                    this._container.style = 'position: absolute; inset: 0; display:flex; flex-direction:column; justify-content:center; align-items:center; background: rgba(0,0,0,0.5); z-index: 10000;'
                    this._container.innerHTML = `
                        <h1 style="font-family: sans-serif; font-size: 48px; color: white; margin-bottom: 16px;">Eindgame</h1>
                        <div style="display:flex; gap:12px;">
                            <button id="mode-normal" style="padding:12px 24px; font-size:18px;">Normaal</button>
                            <button id="mode-speed" style="padding:12px 24px; font-size:18px;">Speed Mode</button>
                        </div>
                        <p style="font-family: sans-serif; font-size: 12px; margin-top:14px; color: #ddd;">Normaal: vaste snelheid. Speed Mode: snelheid neemt toe elke 5 punten.</p>
                    `
                    document.body.appendChild(this._container)
                    this._normalBtn = document.getElementById('mode-normal')
                    this._speedBtn = document.getElementById('mode-speed')
                    this._normalHandler = () => { engine.gameMode = 'normal'; engine.goToScene('play') }
                    this._speedHandler = () => { engine.gameMode = 'speed'; engine.goToScene('play') }
                    this._normalBtn.addEventListener('click', this._normalHandler)
                    this._speedBtn.addEventListener('click', this._speedHandler)
                 }
                onDeactivate() {
                    if (this._normalBtn && this._normalHandler) this._normalBtn.removeEventListener('click', this._normalHandler)
                    if (this._speedBtn && this._speedHandler) this._speedBtn.removeEventListener('click', this._speedHandler)
                    if (this._container && this._container.parentNode) this._container.parentNode.removeChild(this._container)
                    this._container = null
                    this._normalBtn = null
                    this._speedBtn = null
                }
                 onPostUpdate(engine) {
                     if (engine.input.keyboard.wasPressed(Keys.N)) {
                         engine.gameMode = 'normal'
                         engine.goToScene('play')
                     }
                     if (engine.input.keyboard.wasPressed(Keys.S)) {
                         engine.gameMode = 'speed'
                         engine.goToScene('play')
                     }
                 }
             }

             class PlayScene extends Scene {
                 onInitialize(engine) {
                     if (engine.gameMode === 'normal') {
                         engine.obstacleSpeedStep = 0
                     } else {
                         engine.obstacleSpeedStep = -30
                     }
                     engine.startGame()
                 }
             }

             this.addScene('start', new StartScene())
             this.addScene('play', new PlayScene())
             this.goToScene('start')
         }).catch(err => console.error('Resource load failed', err))
    }

    // startGame: zet objecten en timers klaar en voegt actors toe
    startGame() {
        this.isGameOver = false
        this.backgrounds = []
        this.backgroundSpeed = -200
        this.backgroundSpeedFactor = 0.57

        this.backgrounds.push(new Background(0, 'Background1'))
        this.backgrounds.push(new Background(1000, 'Background2'))
        this.backgrounds.push(new Background(2000, 'Background3'))
        this.backgrounds.push(new Background(3000, 'Background4'))
        this.backgrounds.forEach(bg => {
            bg.vel.x = this.backgroundSpeed
            this.add(bg)
        })

        this.add(new Floor())
        this.player = new Player()
        this.add(this.player)

        this.obstacles = []
        this.score = new Score(0)
        this.lives = new Lives(3)
        this.obstacleSpeed = -350
        this.floatingObstacleSpeed = -420
        if (typeof this.obstacleSpeedStep === 'undefined') {
            this.obstacleSpeedStep = -30
        }
        if (!this._highscoreEl) {
            this._highscoreEl = document.createElement('div')
            this._highscoreEl.id = 'highscore'
            this._highscoreEl.style = 'position: absolute; top: 12px; color: white; font-family: sans-serif; font-size: 18px; z-index: 1000; text-shadow: 0 0 6px #000; pointer-events: none;'
            document.body.appendChild(this._highscoreEl)
        }
        
        this._highscoreKey = `eindgame_highscore_${this.gameMode || 'normal'}`
        const storedHigh = parseInt(localStorage.getItem(this._highscoreKey) || '0', 10)
        this._highscoreEl.innerText = `Highscore: ${storedHigh}`
        this._updateHighscorePosition = () => {
            const canvas = document.querySelector('canvas')
            if (!canvas || !this._highscoreEl) return
            const rect = canvas.getBoundingClientRect()
            const rightX = rect.left + rect.width - 12
            this._highscoreEl.style.left = `${Math.max(12, rightX - this._highscoreEl.offsetWidth)}px`
            this._highscoreEl.style.top = `${Math.max(12, rect.top + 12)}px`
        }
        this._updateHighscorePosition()
        window.addEventListener('resize', this._updateHighscorePosition)

        this.obstacleTimer = new Timer({
            fcn: () => this.spawnObstacle(),
            interval: 1800,
            repeats: true
        })
        this.add(this.obstacleTimer)
        this.obstacleTimer.start()

        this.powerups = []
        this.powerupTimer = new Timer({
            fcn: () => this.spawnPowerup(),
            interval: 12000,
            repeats: true
        })
        this.add(this.powerupTimer)
        this.powerupTimer.start()
    }

    spawnObstacle() {
        const spawnCount = 1 + (Math.random() < 0.35 ? 1 : 0)
        for (let i = 0; i < spawnCount; i++) {
            const floating = Math.random() < 0.45
            const y = floating ? 430 + Math.floor(Math.random() * 15) : 365
            const speed = floating ? this.floatingObstacleSpeed : this.obstacleSpeed
            const obstacle = new Obstacle(1100 + i * 70, y, 50, 50, floating, speed)
            this.add(obstacle)
            this.obstacles.push(obstacle)
        }
    }

    spawnPowerup() {
        const floorTop = 580 - 146 / 2
        const powerupY = floorTop - 16
        const powerup = new Powerup(1100, powerupY)
        this.add(powerup)
        this.powerups.push(powerup)
    }

    triggerGameOver() {
        this.isGameOver = true
        this.obstacleTimer.stop()
        this.powerupTimer.stop()
        this.stop() 
        if (!this._gameOverUI) this._gameOverUI = new GameOver()
        this._gameOverUI.show(this.score.score, this.gameMode || 'normal')
        const storedHigh = parseInt(localStorage.getItem(this._highscoreKey) || '0', 10)
        if (this._highscoreEl) this._highscoreEl.innerText = `Highscore: ${storedHigh}`
    }

    gameOver() {
        this.triggerGameOver()
    }

    handlePlayerHit(obstacle) {
        if (!obstacle || obstacle.hit) return
        obstacle.hit = true
        try { obstacle.kill() } catch (e) {}
        if (!this.lives.lose()) {
            this.triggerGameOver()
        }
    }

    addLife(powerup) {
        if (!powerup || powerup.picked) return
        powerup.picked = true
        try { powerup.kill() } catch (e) {}
        this.lives.gain()
    }

    increaseObstacleSpeed() {
        this.obstacleSpeed += this.obstacleSpeedStep
        this.floatingObstacleSpeed += this.obstacleSpeedStep
        this.backgroundSpeed = Math.max(-450, Math.round(this.obstacleSpeed * this.backgroundSpeedFactor))
        for (const bg of this.backgrounds) {
            if (!bg) continue
            bg.vel.x = this.backgroundSpeed
        }
        for (const obs of this.obstacles) {
            if (!obs || obs.pos.x < -100 || obs.hit) continue
            const isFloating = obs.body.collisionType === CollisionType.Passive
            obs.vel.x = isFloating ? this.floatingObstacleSpeed : this.obstacleSpeed
        }
    }

    onPostUpdate() {
        if (this._updateHighscorePosition) this._updateHighscorePosition()
        if (this.isGameOver && this.input.keyboard.wasPressed(Keys.R)) {
            window.location.reload()
        }
        for (let i = 0; i < this.backgrounds.length; i++) {
            let bg = this.backgrounds[i]
            if (bg.pos.x < -1000) {
                bg.pos.x += 4000
            }
        }

        if (this.player && this.obstacles) {
            for (let obs of this.obstacles) {
                if (!obs || obs.scored) continue
                
                // OPGELOST: Toegevoegd `obs.hasTag('obstacle')` zodat de vloer niet onbedoeld getriggerd wordt!
                if (!obs.hit && !this.isGameOver && typeof obs.hasTag === 'function' && obs.hasTag('obstacle')) {
                    const distance = this.player.pos.distance(obs.pos)
                    if (distance < 45) { 
                        this.handlePlayerHit(obs)
                        continue
                    }
                }

                const obsRight = obs.pos.x + (obs.width || 0) / 2
                if (obsRight < this.player.pos.x) {
                    obs.scored = true
                    this.score.add(1)
                    if (this.score.score % 5 === 0) {
                        this.increaseObstacleSpeed()
                    }
                }
            }
            this.obstacles = this.obstacles.filter(o => o && o.pos.x > -500)
        }

        if (this.powerups && this.player) {
            for (let p of this.powerups) {
                if (!p || p.picked || this.isGameOver) continue
                if (typeof p.hasTag === 'function' && p.hasTag('powerup')) {
                    if (this.player.pos.distance(p.pos) < 45) {
                        this.addLife(p)
                    }
                }
            }
            this.powerups = this.powerups.filter(p => p && p.pos.x > -500)
        }
    }
}

new Game()