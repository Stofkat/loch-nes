export class Player {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.jumping = false;
        this.grounded = false;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10;
        this.numberOfFrames = 4;

        this.image = new Image();
        this.image.src = './assets/player-sprite.svg';
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    draw(ctx) {
        if (this.loaded) {
            ctx.drawImage(
                this.image,
                this.frameIndex * this.width,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    update(keys, gravity, friction, canvas) {
        if (keys['ArrowRight']) {
            this.dx = this.speed;
        } else if (keys['ArrowLeft']) {
            this.dx = -this.speed;
        } else {
            this.dx *= friction; // Apply friction when no keys are pressed
        }

        if (keys['ArrowUp'] && !this.jumping && this.grounded) {
            this.dy = -this.speed * 2;
            this.jumping = true;
            this.grounded = false;
        }

        this.dy += gravity;
        this.y += this.dy;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
            this.jumping = false;
            this.grounded = true;
        }

        if (keys['ArrowRight'] || keys['ArrowLeft']) {
            this.tickCount += 1;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
            }
        } else {
            this.frameIndex = 0; // Reset to the first frame when not moving
        }
    }
}
