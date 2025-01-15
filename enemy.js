export class Enemy {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = speed;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(canvas) {
        this.x += this.dx;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.dx *= -1;
        }
    }
}
