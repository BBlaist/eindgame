import { Actor, CollisionType, Vector } from 'excalibur'
import { Resources } from './resources'

export class Powerup extends Actor {
  // Constructor: creëert een powerup die naar links beweegt en opgepakt kan worden
  constructor(x = 1100, y = 900, w = 48, h = 32) {
    super({ x, y, width: w, height: h })
    this.graphics.use(Resources.Powerup.toSprite())
    this.body.collisionType = CollisionType.Passive
    this.vel = new Vector(-250, 0)
    this.picked = false
  }

  // onPostUpdate: verwijdert powerup zodra deze buiten beeld links is
  onPostUpdate() {
    if (this.pos.x < -100) this.kill()
  }
}
