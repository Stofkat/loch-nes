export class Block {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx, scrollOffset) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - scrollOffset, this.y, this.width, this.height);
    }
}
