import { Player } from './player.js';
import { Block } from './block.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const friction = 0.8;
const keys = {};

const player = new Player(canvas.width / 2 - 16, canvas.height - 150, 32, 64, 5); // Adjust width and height to match sprite frame size
const blocks = [
    new Block(0, canvas.height - 50, canvas.width * 2, 50),
    new Block(200, canvas.height - 150, 100, 20),
    new Block(400, canvas.height - 200, 100, 20),
    new Block(600, canvas.height - 250, 100, 20)
];
const enemies = [
    new Enemy(50, canvas.height - 100, 50, 50, 2),
    new Enemy(500, canvas.height - 150, 50, 50, 2)
];

let scrollOffset = 0;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.update(keys, gravity, friction, canvas);

    // Scroll the world
    if (keys['ArrowRight']) {
        scrollOffset += player.dx;
    } else if (keys['ArrowLeft']) {
        scrollOffset += player.dx;
    }

    // Draw and update blocks
    blocks.forEach(block => {
        block.draw(ctx, scrollOffset);
        // Collision detection with blocks
        if (player.x < block.x + block.width - scrollOffset &&
            player.x + player.width > block.x - scrollOffset &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y) {
            // Collision detected
            if (player.dy > 0) { // Falling
                player.y = block.y - player.height;
                player.dy = 0;
                player.jumping = false;
                player.grounded = true;
            } else if (player.dy < 0) { // Jumping
                player.y = block.y + block.height;
                player.dy = 0;
            }
        }
    });

    // Draw and update enemies
    enemies.forEach(enemy => {
        enemy.draw(ctx, scrollOffset);
        enemy.update(canvas, scrollOffset);
        // Collision detection with enemies
        if (player.x < enemy.x + enemy.width - scrollOffset &&
            player.x + player.width > enemy.x - scrollOffset &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            // Collision detected
            document.location.reload();
        }
    });

    // Draw player
    player.draw(ctx);

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

update();
