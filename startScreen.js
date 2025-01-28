export class StartScreen {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.pulseAlpha = 1;
    this.pulseDirection = -1;
    this.pulseSpeed = 0.01;
    this.minAlpha = 0.3;
    this.maxAlpha = 1;

    this.startScreenImage = new Image();
    this.startScreenImage.src = "./assets/title1.png";
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

  draw() {
    this.ctx.clearRect(0, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.startScreenImage, 0, 0, this.canvas.width, this.canvas.height); // Draw scenic background

    // Draw title with outline
    this.drawTextWithOutline("Loch NES", this.canvas.width / 2, this.canvas.height / 2 - 100, 50);
    this.drawTextWithOutline("The Adventures of Judith", this.canvas.width / 2, this.canvas.height / 2 - 50, 30);

    // Draw pulsing "Press any key to start" text with outline
    this.ctx.save();
    this.ctx.globalAlpha = this.pulseAlpha;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + 100);
    this.drawTextWithOutline("Press any key to start", 0, 0, 20);
    this.ctx.restore();

    // Update pulse alpha
    this.pulseAlpha += this.pulseSpeed * this.pulseDirection;
    if (this.pulseAlpha > this.maxAlpha || this.pulseAlpha < this.minAlpha) {
      this.pulseDirection *= -1;
    }
  }
}
