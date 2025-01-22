export class Explosion {
  constructor(x, y, particles) {
    this.particles = particles;
  }

  static createParticles(x, y, width, height, imgTop, imgBottom) {
    const particles = [];
    const patternWidth = 50;
    const patternHeight = 50;
    const particlesPerElement = 5; // Increase the number of particles per element

    for (let i = 0; i < width; i += patternWidth) {
      for (let j = 0; j < height; j += patternHeight) {
        const img = j < patternHeight ? imgTop : imgBottom;
        for (let k = 0; k < particlesPerElement; k++) {
          const angle = Math.random() * 2 * Math.PI;
          const speed = Math.random() * 5 + 2;
          particles.push({
            x: x + i,
            y: y + j,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: Math.random() * 30 + 30,
            size: patternWidth,
            img: img
          });
        }
      }
    }

    return particles;
  }

  draw(ctx, scrollOffset) {
    this.particles.forEach(particle => {
      ctx.drawImage(
        particle.img,
        particle.x - scrollOffset,
        particle.y,
        particle.size,
        particle.size
      );
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
