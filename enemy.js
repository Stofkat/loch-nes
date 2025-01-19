import { GameObject } from "./gameObject.js";

export class Enemy extends GameObject {
  constructor(x, y, width, height, speed) {
    super(x, y, width, height);
    this.speed = speed;
    this.dx = speed;
    this.dy = 0;
    this.gravity = 0.5;
    this.grounded = false;

    this.image = new Image();
    this.image.src = './assets/gnome.png';
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

  update(blocks, scrollOffset) {
    this.dy += this.gravity;
    this.y += this.dy;

    // Collision detection with blocks
    this.grounded = false;
    blocks.forEach(block => {
      if (this.x < block.x + block.width - scrollOffset &&
          this.x + this.width > block.x - scrollOffset &&
          this.y < block.y + block.height &&
          this.y + this.height > block.y) {
        // Collision detected
        if (this.dy > 0) { // Falling
          this.y = block.y - this.height;
          this.dy = 0;
          this.grounded = true;
        }
      }
    });

    if (this.grounded) {
      this.x += this.dx;
      blocks.forEach(block => {
        if (this.x + this.width > block.x + block.width - scrollOffset || this.x < block.x - scrollOffset) {
          this.dx *= -1;
        }
      });
    }
  }


}
