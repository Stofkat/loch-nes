export class Explosion {
  constructor(x, y, numParticles = 20) {
    this.particles = [];
    this.numParticles = numParticles;

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle(x, y));
    }
  }

  createParticle(x, y) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 5 + 2;
    return {
      x: x,
      y: y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: Math.random() * 30 + 30,
      size: Math.random() * 5 + 2,
      color: `rgba(255, ${Math.floor(Math.random() * 255)}, 0, 1)`
    };
  }

  draw(ctx, scrollOffset) {
    this.particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x - scrollOffset, particle.y, particle.size, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  update() {
    this.particles.forEach(particle => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.life -= 1;
      particle.size *= 0.95; // Shrink the particle over time
    });

    // Remove dead particles
    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  isAlive() {
    return this.particles.length > 0;
  }
}
