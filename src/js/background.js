import { Actor, Vector, CollisionType } from "excalibur";
import { Resources } from './resources.js';

export class Background extends Actor {
  constructor(xPos = 0) {
    super({
      x: xPos,
      y: 300,
      width: 1000,
      height: 600
    });
    // PreventCollision is better for backgrounds to save performance
    this.body.collisionType = CollisionType.PreventCollision; 
    
    // Set the velocity directly. Excalibur handles the frame-rate math for you.
    this.vel.x = -200; 
  }

  onInitialize(engine) {
    this.graphics.use(Resources.Background1.toSprite());
  }

  onPostUpdate(engine) {
    // If the background moves completely off the left side of the screen
    // Move it to the back of the line (assuming 1000 is your image width)
    // If your anchor is the default (0.5, 0.5), it is off-screen at -500
    if (this.pos.x <= -500) {
      this.pos.x += 2000; // Jump ahead of the second background
    }
  }
}