import { Actor, CollisionType, Color, Vector } from 'excalibur';

export class Obstacle extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 40,
            height: 60,
            color: Color.Red // Replace with a graphic later if you want
        });
        
        // Fixed means it will trigger collisions but won't be pushed around
        this.body.collisionType = CollisionType.Fixed;
        this.vel.x = -300; // Move left slightly faster than the background
    }

    onPostUpdate(engine) {
        // Clean up the obstacle once it goes off the left screen
        // to prevent memory leaks
        if (this.pos.x < -100) {
            this.kill(); 
        }
    }
}