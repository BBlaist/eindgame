import { Actor, Keys, Vector, CollisionType, Shape } from "excalibur"
import { Resources } from './resources'

export class Player extends Actor {
    constructor() {
        super({ 
            x: 200,
            y: 360,
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
            collider: Shape.Box(64, 64)
        })
        
        this._engine = null
        this._isCrouching = false
        this._crouchOffset = 16
        this.scale = new Vector(1, 1)
    }

    onInitialize(engine) {
        this._engine = engine
        if (Resources.Samus) {
            this.graphics.use(Resources.Samus.toSprite())
        }
        
        this.on("collisionstart", (evt) => this.hitSomething(evt))
    }

    onPreUpdate(engine) {
        const jumpSpeed = 400
        const moveSpeed = 200
        let moveX = 0

        // Horizontale beweging
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

        // Springen (Mag alleen als je NIET bukt en wel op de grond staat)
        if (engine.input.keyboard.wasPressed(Keys.Space) && this.isOnGround() && !this._isCrouching) {
            this.vel = new Vector(this.vel.x, -jumpSpeed)
        }

        // --- OPGELOST: Verbeterde crouch logica ---
        const wantsToCrouch = engine.input.keyboard.isHeld(Keys.Down) || engine.input.keyboard.isHeld(Keys.S)
        
        if (wantsToCrouch) {
            // Je mag alleen beginnen met bukken als je op de grond staat, 
            // maar als je al bukt (this._isCrouching === true), mag je blijven bukken!
            if (this.isOnGround() || this._isCrouching) {
                this.crouch()
            }
        } else {
            this.standUp()
        }
    }

    crouch() {
        if (this._isCrouching) return
        this._isCrouching = true
        this.scale = new Vector(1, 0.5)
        // Verplaats de collider netjes omlaag zodat hij strak op de vloer blijft rusten
        this.pos = new Vector(this.pos.x, this.pos.y + this._crouchOffset) 
    }

    standUp() {
        if (!this._isCrouching) return
        this._isCrouching = false
        this.scale = new Vector(1, 1)
        // Herstel de originele positie weer omhoog
        this.pos = new Vector(this.pos.x, this.pos.y - this._crouchOffset) 
    }

    hitSomething(event) {
        if (!event.other || !event.other.owner) return
        const otherActor = event.other.owner

        if (typeof otherActor.hasTag === 'function') {
            if (otherActor.hasTag('obstacle')) {
                if (this._engine && typeof this._engine.handlePlayerHit === 'function') {
                    this._engine.handlePlayerHit(otherActor)
                }
            }
            
            if (otherActor.hasTag('powerup')) {
                if (this._engine && typeof this._engine.addLife === 'function') {
                    this._engine.addLife(otherActor)
                }
            }
        }
    }

    isOnGround() {
        // Een kleine marge vangt schommelingen op de grond perfect op
        return Math.abs(this.vel.y) < 5 
    }
}