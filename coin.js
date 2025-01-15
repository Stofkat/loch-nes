export class Coin {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collected = false;

        this.image = new Image();
        this.image.src = './assets/coin.svg';
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    draw(ctx, scrollOffset) {
        if (!this.collected && this.loaded) {
            ctx.drawImage(
                this.image,
                this.x - scrollOffset,
                this.y,
                this.width,
                this.height
            );
        }
    }

    collect(player, scrollOffset) {
        if (!this.collected &&
            player.x < this.x + this.width - scrollOffset &&
            player.x + player.width > this.x - scrollOffset &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            this.collected = true;
            return true;
        }
        return false;
    }
}
