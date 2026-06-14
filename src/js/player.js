import { Actor, Keys, Vector, CollisionType } from "excalibur"
import { Resources } from './resources'

export class Player extends Actor {

    constructor() {
        super({ 
            width: 64,
            height: 64
        })
        this.pos = new Vector(200, 360)
        this.body.collisionType = CollisionType.Active
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Hollow.toSprite())
    }

    onPreUpdate(engine) {
        const jumpSpeed = 400

        if (engine.input.keyboard.wasPressed(Keys.Space) && this.isOnGround()) {
            this.vel = new Vector(this.vel.x, -jumpSpeed)
        }
    }

    isOnGround() {
        return Math.abs(this.vel.y) < 1
    }
}
