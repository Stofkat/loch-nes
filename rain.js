export class Rain {
    constructor(canvas, numDrops) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.numDrops = numDrops;
        this.drops = [];

        for (let i = 0; i < this.numDrops; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 2
            });
        }
    }

    update() {
        this.drops.forEach(drop => {
            drop.y += drop.speed;
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
    }

    draw() {
        this.ctx.strokeStyle = 'rgba(7, 91, 219, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'square';

        this.drops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();
        });
    }
}
