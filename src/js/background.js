import { Actor, CollisionType } from "excalibur";
import { Resources } from './resources.js';

export class Background extends Actor {
  // Constructor: achtergrond actor met standaard positie en grootte
  constructor(xPos = 0, key = 'Background1') {
    super({
      x: xPos,
      y: 300,
      width: 1000,
      height: 600,
      collisionType: CollisionType.PreventCollision // Direct instellen in de super call is veiliger
    });
    this.vel.x = -200;
    this.key = key;
  }

  // onInitialize: zet de sprite afbeelding voor deze achtergrond
  onInitialize(engine) {
    this.setImage(this.key);
  }

  // setImage: kiest welke resource-achtergrond afbeelding gebruikt wordt
  setImage(key) {
    this.key = key;
    if (Resources[key]) {
      this.graphics.use(Resources[key].toSprite());
    }
  }

  // onPostUpdate: per-frame logica voor de achtergrond (placeholder)
  onPostUpdate(engine) {
    // Wordt afgehandeld door de hoofd-game loop voor wrapping
  }
}