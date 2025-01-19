import { GameObject } from "./gameObject.js";

export class Block extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.image = new Image();
    this.image.src = '/assets/block.png';
  }

  draw(ctx, scrollOffset) {
    const patternWidth = 50; // Width of the texture
    const patternHeight = 50; // Height of the texture

    for (let i = 0; i < this.width; i += patternWidth) {
      for (let j = 0; j < this.height; j += patternHeight) {
        ctx.drawImage(this.image, this.x - scrollOffset + i, this.y + j, patternWidth, patternHeight);
      }
    }
  }
}