import { Actor, CollisionType, Shape } from "excalibur"
import { Resources } from './resources.js'

export class Floor extends Actor {
  // Constructor: maakt de vloer actor en stelt afbeelding en collider in
  constructor() {
    super({
      x: 500,
      y: 580,
      width: 1000,
      height: 146,
      collisionType: CollisionType.Fixed, // Direct in de config laden voorkomt timing problemen
      collider: Shape.Box(1000, 146)     // Expliciete collider definitie voor de productie build
    })
    
    // Zorg dat de sprite direct geladen wordt
    if (Resources.Floor) {
      this.graphics.use(Resources.Floor.toSprite())
    }
  }
}