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
  }

  draw(ctx, scrollOffset) {
    if (this.loaded) {
      ctx.save();
      if (!this.facingRight) {
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
  }

  update(objects, scrollOffset) {
    this.x += this.dx;
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
    }

    // Check for block diagonally underneath in the direction they are facing
    let onBlock = false;
    const checkX1 = this.facingRight ? this.x + this.width : this.x;
    const checkX2 = this.facingRight ? this.x + this.width : this.x - 1;

    const checkY = this.y + this.height + 10;

    objects.forEach((gameObj) => {
      if (gameObj instanceof Block && 
        ((checkX1 > gameObj.x && checkX1 < gameObj.x + gameObj.width) ||
        (checkX2 > gameObj.x && checkX2 < gameObj.x + gameObj.width)) 
        &&
          (checkY >= gameObj.y &&
          checkY <= gameObj.y + gameObj.height)
      ) {
        onBlock = true;
      }
    });

    if (!onBlock) {
      this.dx = -this.dx; // Turn in the opposite direction
      this.facingRight = this.dx > 0;
    }
  }
}
