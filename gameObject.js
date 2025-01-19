export class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, scrollOffset) {
    // Default draw method, can be overridden by subclasses
  }

  update(blocks, scrollOffset) {
    // Default update method, can be overridden by subclasses
  }

  checkCollision(player, scrollOffset) {
    // Default collision check method, can be overridden by subclasses
  }
}
