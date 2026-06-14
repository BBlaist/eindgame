import { Actor, CollisionType, Vector, Shape } from 'excalibur'
import { Resources } from './resources'

export class Powerup extends Actor {
  // Constructor: creëert een powerup die naar links beweegt en opgepakt kan worden
  constructor(x = 1100, y = 900, w = 48, h = 32) {
    super({ 
      x, 
      y, 
      width: w, 
      height: h,
      collisionType: CollisionType.Passive, // Ingesteld in config voor timing-veiligheid
      collider: Shape.Box(w, h)             // Hardcoded collider voor betrouwbare hitboxes
    })
    
    // Vite-proof tagging systeem
    this.addTag('powerup')

    if (Resources.Powerup) {
      this.graphics.use(Resources.Powerup.toSprite())
    }
    
    this.vel = new Vector(-250, 0)
    this.picked = false
  }

  // onPostUpdate: verwijdert powerup zodra deze buiten beeld links is
  onPostUpdate() {
    if (this.pos.x < -100) this.kill()
  }
}