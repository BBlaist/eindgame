import { Actor, Keys, Vector, CollisionType } from "excalibur"
import { Resources } from './resources'

export class Player extends Actor {
    
    // Constructor: initialiseert speleractor (grootte, positie en collider)
    constructor() {
        super({ 
            width: 64,
            height: 64
        })
        this.pos = new Vector(200, 360)
        this.body.collisionType = CollisionType.Active
        this._engine = null
        this._isCrouching = false
        this._crouchOffset = 16
        this.scale = new Vector(1, 1)
    }

    // onInitialize: zet graphics en event listeners voor collisions
    onInitialize(engine) {
        this._engine = engine
        this.graphics.use(Resources.Samus.toSprite())
        this.on("collisionstart", (evt) => this.hitSomething(evt))
    }

    // onPreUpdate: verwerkt input per frame (beweging, springen, duiken)
    onPreUpdate(engine) {
        const jumpSpeed = 400
        const moveSpeed = 200
        let moveX = 0

        if (engine.input.keyboard.isHeld(Keys.Left) || engine.input.keyboard.isHeld(Keys.A)) {
            moveX -= 1
        }
        if (engine.input.keyboard.isHeld(Keys.Right) || engine.input.keyboard.isHeld(Keys.D)) {
            moveX += 1
        }

        if (moveX !== 0) {
            this.vel = new Vector(moveX * moveSpeed, this.vel.y)
        } else {
            this.vel = new Vector(0, this.vel.y)
        }

        if (engine.input.keyboard.wasPressed(Keys.Space) && this.isOnGround()) {
            this.vel = new Vector(this.vel.x, -jumpSpeed)
        }

        const crouch = engine.input.keyboard.isHeld(Keys.Down) || engine.input.keyboard.isHeld(Keys.S)
        if (crouch && this.isOnGround()) {
            this.crouch()
        } else {
            this.standUp()
        }
    }

    // crouch: verkort visueel de speler en verplaatst positie omlaag
    crouch() {
        if (this._isCrouching) return
        this._isCrouching = true
        this.scale = new Vector(1, 0.5)
        this.pos = new Vector(this.pos.x, this.pos.y + this._crouchOffset)
    }

    // standUp: zet de speler weer in normale houding terug
    standUp() {
        if (!this._isCrouching) return
        this._isCrouching = false
        this.scale = new Vector(1, 1)
        this.pos = new Vector(this.pos.x, this.pos.y - this._crouchOffset)
    }

    // hitSomething: collision handler die bepaalt wat er geraakt is
    // en acties (leven verliezen / powerup oppakken) aanroept
    hitSomething(event) {
        if (!event.other || !event.other.owner) return
        const other = event.other.owner
        if (other.constructor && other.constructor.name === 'Obstacle') {
            if (this._engine && typeof this._engine.handlePlayerHit === 'function') {
                this._engine.handlePlayerHit(other)
            }
        }
        if (other.constructor && other.constructor.name === 'Powerup') {
            if (this._engine && typeof this._engine.addLife === 'function') {
                this._engine.addLife(other)
            }
        }
    }

    // isOnGround: simpele check of de speler stil valt (nabij 0 verticale snelheid)
    isOnGround() {
        return Math.abs(this.vel.y) < 1
    }
}
