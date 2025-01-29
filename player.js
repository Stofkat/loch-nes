import { Coin } from "./coin.js";
import { Nessie } from "./nessie.js";
import { Treasure } from "./treasure.js";
import { Enemy } from "./enemy.js";

const soundCoin = new Audio("./sound/coin.wav");
const soundDeath = new Audio("./sound/death.wav");
const soundNessie = new Audio("./sound/nessie.wav");

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
    this.grounded = false;  // Reset grounded state each frame

    for (const gameObj of objects) {
        // Calculate collision bounds with border adjustment
        const playerLeft = this.x + this.borderWidth;
        const playerRight = this.x + this.width - this.borderWidth;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;
        
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
                // If player is above the enemy and moving down
                if (playerCenterY < gameObj.y && this.dy > 0) {
                    // Kill enemy
                    gameObj.isDead = true;
                    // Bounce player up
                    this.dy = -this.speed * 1.5;
                    this.jumping = true;
                    this.score += 10;
                } else {
                    // Player dies
                    if (!this.isDead) {
                        this.isDead = true;
                        soundDeath.play();
                    }
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
