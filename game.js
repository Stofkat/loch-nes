import { Player } from './player.js';
import { Block } from './block.js';
import { Enemy } from './enemy.js';
import { Water } from './water.js';
import { Coin } from './coin.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const friction = 0.8;
const keys = {};

// Load sound effects
const coinSound = new Audio('./assets/coin-collect.mp3');

const player = new Player(canvas.width / 2 - 16, canvas.height - 150, 32, 64, 5); // Adjust width and height to match sprite frame size
const blocks = [
    new Block(0, canvas.height - 50, canvas.width * 2, 50),
    new Block(200, canvas.height - 150, 100, 20),
    new Block(400, canvas.height - 200, 100, 20),
    new Block(600, canvas.height - 250, 100, 20)
];
const enemies = [
    new Enemy(500, canvas.height - 400, 64, 64, 2) // Adjusted size to match the new sprite
];
const waterBlocks = [];
for (let i = 0; i < canvas.width * 2; i += 32) {
    waterBlocks.push(new Water(i, canvas.height - 40, 32, 20, 7, 0.02, '#0000FFDD')); // Higher and asymmetrical waves
}
const coins = [
    new Coin(50, canvas.height - 70, 16, 16), // Coin on the ground
    new Coin(250, canvas.height - 170, 16, 16), // Coin on the first platform
    new Coin(450, canvas.height - 220, 16, 16), // Coin on the second platform
    new Coin(650, canvas.height - 270, 16, 16) // Coin on the third platform
];

let scrollOffset = 0;
let scrollSpeed = 0;

function update(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.update(keys, gravity, friction, canvas);

    // Scroll the world
    if (keys['ArrowRight']) {
        scrollSpeed = player.speed;
    } else if (keys['ArrowLeft']) {
        scrollSpeed = -player.speed;
    } else {
        scrollSpeed *= friction; // Apply friction to the scroll speed
    }
    scrollOffset += scrollSpeed;

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

    // Draw and update coins
    coins.forEach(coin => {
        coin.draw(ctx, scrollOffset);
        if (coin.collect(player, scrollOffset)) {
            coinSound.play();
            console.log('Coin collected!');
        }
    });

    // Draw water blocks
    waterBlocks.forEach(water => {
        water.draw(ctx, time);
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
