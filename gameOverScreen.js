export class GameOverScreen {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.startScreenImage = new Image();
    this.startScreenImage.src = "./assets/game-over.jpeg";
  }

  drawTextWithOutline(text, x, y, fontSize) {
    this.ctx.font = `${fontSize}px "Press Start 2P"`; // Use 8-bit font
    this.ctx.textAlign = "center";
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "black";
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, x, y);
  }

  draw(score) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.startScreenImage, 0, 0, this.canvas.width, this.canvas.height); // Draw scenic background


    // Draw game over text with outline
    this.drawTextWithOutline("You lost the game", this.canvas.width / 2, this.canvas.height / 2 - 100, 40);
    this.drawTextWithOutline(`Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2, 30);
    this.drawTextWithOutline("Press any key to restart", this.canvas.width / 2, this.canvas.height / 2 + 100, 20);
  }
}
