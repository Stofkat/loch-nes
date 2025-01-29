export class Water {
    constructor(x, y, width, height, waveAmplitude, waveFrequency, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 100;
        this.waveAmplitude = waveAmplitude;
        this.waveFrequency = waveFrequency;
        this.offset = 0;
        this.color = color;
    }

    draw(ctx, time) {
        const wave = Math.sin((time / 8 + this.x) * this.waveFrequency) * this.waveAmplitude;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x , this.y + wave, this.width, this.height);
    }
}
