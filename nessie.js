export class Nessie {
  constructor(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.dx = speed;

      this.image = new Image();
      this.image.src = './assets/nessie.png';
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

  update() {
      this.x += this.dx;
  }

  checkCollision(player, scrollOffset) {

  }
}
