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
      if (player.x + player.borderWidth < this.x + this.width - scrollOffset &&
          player.x + player.width - player.borderWidth > this.x - scrollOffset &&
          player.y < this.y + this.height &&
          player.y + player.height > this.y) {
          // Collision detected
          document.location.reload();
      }
  }
}
