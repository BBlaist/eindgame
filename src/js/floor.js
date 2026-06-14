import { Actor, CollisionType, Shape } from "excalibur"
import { Resources } from './resources.js'

export class Floor extends Actor {
  constructor() {
    super({
      x: 500,
      y: 580,
      width: 1000,
      height: 146,
      collisionType: CollisionType.Fixed, 
      collider: Shape.Box(1000, 146)
    })
    
    // Vite-proof tagging to make sure our fallback loop ignores it
    this.addTag('floor')

    if (Resources.Floor) {
      this.graphics.use(Resources.Floor.toSprite())
    }
  }
}