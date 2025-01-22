import { Block } from "./block.js";
import { Explosion } from './explosion.js';

export class Nessie {
  constructor(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.dx = speed;

      this.image = new Image();
      this.image.src = './assets/nessie.png';
      this.image.onload = () => {
          this.loaded = true;
      };
  }

  draw(ctx, scrollOffset) {
      if (this.loaded) {
          ctx.drawImage(
              this.image,
              this.x - scrollOffset,
              this.y,
              this.width,
              this.height
          );
      }
  }

  update(gameObjects, scrollOffset) {
      this.x += this.dx;

      // Check for collision with blocks
      gameObjects.forEach((obj, index) => {
          if (obj instanceof Block) {
              if (
                  this.x < obj.x + obj.width  &&
                  this.x + this.width > obj.x  &&
                  this.y < obj.y + obj.height &&
                  this.y + this.height > obj.y
              ) {
                  // Trigger explosion
                  const explosion = new Explosion(obj.x + obj.width / 2, obj.y + obj.height / 2);
                  gameObjects.push(explosion);

                  // Remove the block
                  gameObjects.splice(index, 1);
              }
          }
      });
  }

  checkCollision(player, scrollOffset) {

  }
}
