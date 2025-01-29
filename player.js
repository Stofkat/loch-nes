import { Coin } from "./coin.js";
import { Nessie } from "./nessie.js";
import { Treasure } from "./treasure.js";
import { Enemy } from "./enemy.js";

const soundCoin = new Audio("./sound/coin.wav");
const soundDeath = new Audio("./sound/death.wav");
const soundNessie = new Audio("./sound/nessie.wav");
const soundGnomeDeath = new Audio("./sound/gnome.mp3");

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

    this.invincible = false;
    this.invincibilityTime = 0;
    this.maxInvincibilityTime = 60; // 1 second at 60fps
    this.deathRotation = 0;
    this.deathFallSpeed = -10; // Initial upward velocity when dying
    this.deathGravity = 0.5;
  }

  draw(ctx) {
    if (!this.loaded) return;

    ctx.save();


    if (this.isDead) {
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.deathRotation);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    } else if (!this.facingRight) {
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

  update(keys, gravity, canvas) {
    if (this.isDead) {
      this.deathRotation += 0.2;
      this.deathFallSpeed += this.deathGravity;
      this.y += this.deathFallSpeed;
      return;
    }

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
    this.grounded = false;  // Reset grounded state each frame

    const playerLeft = this.x + this.borderWidth;
    const playerRight = this.x + this.width - this.borderWidth;
    const playerTop = this.y;
    const playerBottom = this.y + this.height;

    if (playerBottom > 600 - 10 && !this.isDead) {
      this.isDead = true;
      soundDeath.play();
    }

    for (const gameObj of objects) {
      // Calculate collision bounds with border adjustment
      const objLeft = gameObj.x - scrollOffset;
      const objRight = gameObj.x + gameObj.width - scrollOffset;
      const objTop = gameObj.y;
      const objBottom = gameObj.y + gameObj.height;

      // Check if there's any overlap
      if (playerRight > objLeft &&
        playerLeft < objRight &&
        playerBottom > objTop &&
        playerTop < objBottom) {

        // Handle enemy collisions
        if (gameObj instanceof Enemy && !gameObj.isDead) {
          const playerCenterY = this.y + this.height / 2;
          // Check if the player is jumping and the enemy is below the player
          if (playerCenterY < gameObj.y && this.dy > 0) {
            // Kill enemy
            gameObj.isDead = true;
            this.dy = -this.speed * 1.5;
            this.jumping = true;
            this.score += 10;
            soundGnomeDeath.play();
          }

          // Player dies
          if (!this.isDead && !gameObj.isDead) {
            this.isDead = true;
            this.deathFallSpeed = -10;
            soundDeath.play();
          }
          continue;
        }


        // Handle Nessie collision
        if (gameObj instanceof Nessie && !this.isDead) {
          this.isDead = true;
          soundDeath.play();
          continue;
        }

        // Handle coin collection
        if (gameObj instanceof Coin) {
          if (!gameObj.collected) {
            soundCoin.play();
            this.score += 5;
            gameObj.collected = true;
          }
          continue;
        }

        // Handle treasure collection
        if (gameObj instanceof Treasure) {
          if (!gameObj.collected) {
            gameObj.collected = true;
            this.score += 100;
            objects.push(new Nessie(4000, 200, 800, 400, 3));
            soundNessie.play();
          }
          continue;
        }

        // Handle platform collisions
        const overlapX = Math.min(playerRight - objLeft, objRight - playerLeft);
        const overlapY = Math.min(playerBottom - objTop, objBottom - playerTop);

        if (overlapX < overlapY) {
          // Horizontal collision
          if (playerRight - objLeft < objRight - playerLeft) {
            this.x = objLeft - this.width + this.borderWidth;
          } else {
            this.x = objRight - this.borderWidth;
          }
          collision = true;
        } else {
          // Vertical collision
          if (playerBottom - objTop < objBottom - playerTop) {
            // Landing on top
            this.y = objTop - this.height;
            this.dy = 0;
            this.jumping = false;
            this.grounded = true;
          } else {
            // Hitting from below
            this.y = objBottom;
            this.dy = 0;
          }
        }
      }
    }

    return collision;
  }
}
