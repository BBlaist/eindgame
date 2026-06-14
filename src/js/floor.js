import { Actor, Vector, CollisionType } from "excalibur"
import { Resources } from './resources.js'

export class Floor extends Actor {
  // Constructor: maakt de vloer actor en stelt afbeelding en collider in
  constructor() {
    super({
      x: 500,
      y: 580,
      width: 1000,
      height: 146
    })
    this.graphics.use(Resources.Floor.toSprite())
    this.body.collisionType = CollisionType.Fixed
  }
}