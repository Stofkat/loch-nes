import { Block } from "./block.js";
import { Enemy } from "./enemy.js";

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
      if (
        this.x < obj.x + obj.width &&
        this.x + this.width > obj.x &&
        this.y < obj.y + obj.height &&
        this.y + this.height > obj.y
      ) {
        if (obj instanceof Block) {

          // Trigger explosion
          const soundExplosion = new Audio("./sound/explosion.wav");
          soundExplosion.play();
          const explosion = obj.createExplosion();
          gameObjects.push(explosion);


          // Remove the block
          gameObjects.splice(index, 1);
        }

        if (obj instanceof Enemy) {
          const soundGnomeDeath = new Audio("./sound/gnome.mp3");
          soundGnomeDeath.play();
          gameObjects.splice(index, 1);
        }

      }


    });
  }

  checkCollision(player, scrollOffset) {

  }
}
