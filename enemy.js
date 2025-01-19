import { GameObject } from "./gameObject.js";

export class Enemy extends GameObject {
  constructor(x, y,) {
    super(x, y, 60, 64);
    this.speed = 1;
    this.dx = this.speed;
    this.dy = 0;
    this.gravity = 0.5;
    this.grounded = true;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 3;
    this.numberOfFrames = 8;
    this.facingRight = true;

    this.image = new Image();
    this.image.src = './assets/gnome.png';
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

  update(blocks, scrollOffset) {

    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
    }

    if (this.grounded) {
      this.x += this.dx;
    }
  }
}
