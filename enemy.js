import { Block } from "./block.js";
import { GameObject } from "./gameObject.js";

export class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y, 60, 64);
    this.speed = 1;
    this.dx = Math.random() < 0.5 ? -this.speed : this.speed; // Randomly move left or right
    this.dy = 0;
    this.gravity = 0.5;
    this.grounded = true;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 3;
    this.numberOfFrames = 8;
    this.facingRight = this.dx > 0;

    this.image = new Image();
    this.image.src = "./assets/gnome.png";
    this.image.onload = () => {
      this.loaded = true;
    };

    this.isDead = false;
    this.deathTimer = 0;
    this.maxDeathTime = 30; // Frames before removal
    this.deathRotation = 0;  // Track rotation during death
    this.deathRotationSpeed = Math.PI / 15;  // Rotation speed when dying
    this.deathFallSpeed = 2;  // Initial upward velocity when dying
    this.deathGravity = 0.4;  // Gravity applied during death animation
  }

  draw(ctx, scrollOffset) {
    if (!this.loaded) return;
    
    ctx.save();
    if (this.isDead) {
      // Improved death animation with rotation and arc motion
      ctx.translate(this.x + this.width / 2 - scrollOffset, this.y + this.height / 2);
      ctx.rotate(this.deathRotation);
      ctx.translate(-(this.x + this.width / 2 - scrollOffset), -(this.y + this.height / 2));
    } else if (!this.facingRight) {
      ctx.translate(this.x + this.width / 2 - scrollOffset, this.y + this.height / 2);
      ctx.scale(-1, 1);
      ctx.translate(-(this.x + this.width / 2 - scrollOffset), -(this.y + this.height / 2));
    }
    
    ctx.drawImage(
      this.image,
      this.frameIndex * this.width,
      0,
      this.width,
      this.height,
      this.x - scrollOffset,
      this.y,
      this.width,
      this.height
    );
    ctx.restore();
  }

  update(objects, scrollOffset) {
    if (this.isDead) {
      this.deathTimer++;
      this.deathRotation += this.deathRotationSpeed;
      this.deathFallSpeed += this.deathGravity;
      this.y += this.deathFallSpeed;
      return;
    }

    this.x += this.dx;
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
    }

    // Check for block diagonally underneath in the direction they are facing
    let onBlock = false;
    const checkX1 = this.facingRight ? this.x + this.width : this.x;
    const checkX2 = this.facingRight ? this.x -5 + this.width : this.x + 5;

    const checkY = this.y + this.height + 10;

    objects.forEach((gameObj) => {
      if (
        gameObj instanceof Block &&
        ((checkX1 > gameObj.x && checkX1 < gameObj.x + gameObj.width) ||
          (checkX2 > gameObj.x && checkX2 < gameObj.x + gameObj.width)) &&
        checkY >= gameObj.y &&
        checkY <= gameObj.y + gameObj.height
      ) {
        onBlock = true;
      }
    });

    if (!onBlock) {
      this.dx = -this.dx; // Turn in the opposite direction
      this.facingRight = this.dx > 0;
    }
  }

  shouldRemove() {
    return this.isDead && this.deathTimer >= this.maxDeathTime;
  }
}
