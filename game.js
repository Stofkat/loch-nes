import { Player } from './player.js';
import { Block } from './block.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const friction = 0.8;
const keys = {};

const player = new Player(50, canvas.height - 150, 32, 64, 5); // Adjust width and height to match sprite frame size
const blocks = [
    new Block(0, canvas.height - 50, canvas.width, 50),
    new Block(200, canvas.height - 150, 100, 20),
    new Block(400, canvas.height - 200, 100, 20)
];
const enemies = [
    new Enemy(300, canvas.height - 100, 50, 50, 2)
];

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(keys, gravity, friction, canvas);
    blocks.forEach(block => {
        block.draw(ctx);
        if (player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y) {
            player.grounded = true;
            player.jumping = false;
            player.dy = 0;
            player.y = block.y - player.height;
        }
    });
    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update(canvas);
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            document.location.reload();
        }
    });
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

update();
