export class Enemy {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = speed;

        this.image = new Image();
        this.image.src = './assets/loch-ness-monster.svg';
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

    update(canvas, scrollOffset) {
        this.x += this.dx;
        if (this.x + this.width > canvas.width + scrollOffset || this.x < scrollOffset) {
            this.dx *= -1;
        }
    }
}
