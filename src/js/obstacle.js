import { Actor, CollisionType, Shape, Vector, Color } from 'excalibur'
import { Resources } from './resources.js'

export class Obstacle extends Actor {
  // Constructor: maakt een obstakel met willekeurige grootte en kleur
  // en stelt collider en snelheid in afhankelijk van type (zwevend/grond)
  constructor(x = 1100, y = 540, maxW = 80, maxH = 80, floating = false, speed = null) {
    const minW = Math.max(75, Math.floor(maxW * 0.5))
    const minH = Math.max(75, Math.floor(maxH * 0.5))
    const w = minW + Math.floor(Math.random() * (maxW - minW + 1))
    const h = minH + Math.floor(Math.random() * (maxH - minH + 1))
    
    super({ 
      x, 
      y, 
      width: w, 
      height: h,
      collisionType: floating ? CollisionType.Passive : CollisionType.Active,
      collider: Shape.Box(w, h) // Geoptimaliseerde en stabiele collider toewijzing
    })

    // Vite-proof tagging systeem
    this.addTag('obstacle')

    if (Resources.Enemy) {
      const sprite = Resources.Enemy.toSprite()
      const colors = [Color.Red, Color.Green, Color.Blue, Color.Yellow, Color.Magenta, Color.Cyan, Color.Orange]
      sprite.tint = colors[Math.floor(Math.random() * colors.length)]
      this.graphics.use(sprite)
      this.scale = new Vector(w / sprite.width, h / sprite.height)
    }

    this.vel.x = speed !== null ? speed : (floating ? -420 : -350)
    this.scored = false
    this.hit = false
  }

  // onPostUpdate: verwijdert obstakel zodra het buiten beeld links is
  onPostUpdate() {
    if (this.pos.x < -100) {
      this.kill()
    }
  }
}