import { Coin } from "./coin.js";
import { Nessie } from "./nessie.js";

const soundCoin = new Audio("./sound/coin.wav");
const soundDeath = new Audio("./sound/death.wav");

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 75;
    this.borderWidth = 25;
    this.speed = 5;
    this.dx = 0;
    this.dy = 0;
    this.jumping = false;
    this.grounded = false;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 3;
    this.numberOfFrames = 8;
    this.facingRight = true;

    this.score = 0;
    this.isDead = false;

    this.image = new Image();
    this.image.src = "./assets/player.png";
    this.image.onload = () => {
      this.loaded = true;
    };
  }

  draw(ctx) {
    if (this.loaded) {
      ctx.save();
      if (!this.facingRight) {
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(-1, 1);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      }
      ctx.drawImage(
        this.image,
        this.frameIndex * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();
    }
  }

  update(keys, gravity, canvas) {
    if (keys["ArrowRight"]) {
      this.dx = this.speed;
      this.facingRight = true;
    } else if (keys["ArrowLeft"]) {
      this.dx = -this.speed;
      this.facingRight = false;
    } else {
      this.dx = 0; // No friction applied here
    }

    if (keys[" "] && !this.jumping && this.grounded) {
      this.dy = -this.speed * 2.5;
      this.jumping = true;
      this.grounded = false;
    }

    this.dy += gravity;
    this.y += this.dy;

    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.dy = 0;
      this.jumping = false;
      this.grounded = true;
    }

    if (keys["ArrowRight"] || keys["ArrowLeft"]) {
      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
      }
    } else {
      this.frameIndex = 0; // Reset to the first frame when not moving
    }
  }

  checkCollision(objects, scrollOffset) {
    let collision = false;
    for (const gameObj of objects) {
      if (
        this.x + this.borderWidth < gameObj.x + gameObj.width - scrollOffset &&
        this.x + this.width - this.borderWidth > gameObj.x - scrollOffset &&
        this.y < gameObj.y + gameObj.height &&
        this.y + this.height > gameObj.y
      ) {
        // Nessie collision == death
        if (gameObj instanceof Nessie && !this.isDead) {
          this.isDead = true;
          soundDeath.play();
        }

        // Coin collected
        else if (gameObj instanceof Coin) {
          if (!gameObj.collected) {
            soundCoin.play();
            this.score += 5;
            gameObj.collected = true;
          }
        }
        // Collision detected
        else if (this.dy > 0) {
          // Falling
          this.y = gameObj.y - this.height;
          this.dy = 0;
          this.jumping = false;
          this.grounded = true;
        } else {
          collision = true;
        }
      }
    }

    return collision;
  }
}
