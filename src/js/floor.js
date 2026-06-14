import { Actor, Vector, CollisionType } from "excalibur"
import { Resources } from './resources.js'

export class Floor extends Actor {
  constructor() {
    super({
      x: 500,
      y: 580,
      width: 1000,
      height: 40
    })
    this.graphics.use(Resources.Floor.toSprite())
    this.body.collisionType = CollisionType.Fixed
  }
}