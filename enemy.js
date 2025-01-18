export class Enemy {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = speed;
        this.dy = 0;
        this.gravity = 0.5;
        this.grounded = false;

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

    update(blocks, scrollOffset) {
        this.dy += this.gravity;
        this.y += this.dy;

        // Collision detection with blocks
        this.grounded = false;
        blocks.forEach(block => {
            if (this.x < block.x + block.width - scrollOffset &&
                this.x + this.width > block.x - scrollOffset &&
                this.y < block.y + block.height &&
                this.y + this.height > block.y) {
                // Collision detected
                if (this.dy > 0) { // Falling
                    this.y = block.y - this.height;
                    this.dy = 0;
                    this.grounded = true;
                }
            }
        });

        if (this.grounded) {
            this.x += this.dx;
            blocks.forEach(block => {
                if (this.x + this.width > block.x + block.width - scrollOffset || this.x < block.x - scrollOffset) {
                    this.dx *= -1;
                }
            });
        }
    }

    checkCollision(player, scrollOffset) {
        if (player.x < this.x + this.width - scrollOffset &&
            player.x + player.width > this.x - scrollOffset &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            // Collision detected
            document.location.reload();
        }
    }
}
