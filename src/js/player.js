import { Actor, Keys, Vector, CollisionType, Shape } from "excalibur"
import { Resources } from './resources'

export class Player extends Actor {
    
    // Constructor: initialiseert speleractor (grootte, positie en collider)
    constructor() {
        super({ 
            x: 200,
            y: 360,
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
            collider: Shape.Box(64, 64) // Direct hardcoded toewijzen voorkomt timing-fouten in de build
        })
        
        this._engine = null
        this._isCrouching = false
        this._crouchOffset = 16
        this.scale = new Vector(1, 1)
    }

    // onInitialize: zet graphics en event listeners voor collisions
    onInitialize(engine) {
        this._engine = engine
        if (Resources.Samus) {
            this.graphics.use(Resources.Samus.toSprite())
        }
        
        // Luister naar collisionstart event
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

    // hitSomething: collision handler die tags controleert ipv class constructor namen
    hitSomething(event) {
        if (!event.other) return
        
        const otherActor = event.other;

        // Controleer met .hasTag() -> dit werkt ALTIJD, zelfs na minificatie door Vite!
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

    // isOnGround: simpele check of de speler stil valt (nabij 0 verticale snelheid)
    isOnGround() {
        return Math.abs(this.vel.y) < 1
    }
}