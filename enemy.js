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
    const checkX = (this.facingRight ? this.x + (this.width /2) : this.x - (this.width/2)) -scrollOffset;
    const checkY = this.y  + (this.height /2);

    console.log("checkX", checkX);
    console.log("checkY", checkY);

    objects.forEach((gameObj) => {
      if (
        gameObj instanceof Block,
        checkX < gameObj.x + gameObj.width  &&
        checkX + this.width > gameObj.x &&
        checkY < gameObj.y + gameObj.height &&
        checkY + this.height > gameObj.y
      ) {
        onBlock = true;
        console.log("on block");
      }
    });

    if (!onBlock) {
      this.dx = -this.dx; // Turn in the opposite direction
      this.facingRight = this.dx > 0;
    }
  }
}
