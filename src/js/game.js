import '../css/style.css'
import { Actor, Engine, DisplayMode, SolverStrategy, Vector } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player'
import { Floor } from './floor.js'
import { Background } from './background.js'


export class Game extends Engine {

    constructor() {
        super({ 
            width: 1000, 
            height: 600, 
            maxFps: 60, 
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 800),
            }
         })
         console.log("hallo dit is mijn game")
         this.showDebug(true)
        this.backgrounds = []
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        this.backgrounds = []
        this.backgrounds.push(new Background(0))
        this.backgrounds.push(new Background(1000))
        this.backgrounds.forEach(bg => this.add(bg))
        
        this.add(new Floor())
        this.add(new Player())
    }

    onPostUpdate() {
        for (let i = 0; i < this.backgrounds.length; i++) {
            let bg = this.backgrounds[i]
            if (bg.pos.x < -1000) {
                bg.pos.x = 1000
            }
            if (bg.pos.x > 1500) {
                bg.pos.x = -1000
            }
        }
    }
}

new Game()
