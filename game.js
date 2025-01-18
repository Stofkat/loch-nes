import { Player } from './player.js';
import { Block } from './block.js';
import { Enemy } from './enemy.js';
import { Water } from './water.js';
import { Coin } from './coin.js';
import { Nessie } from './nessie.js';
import { Rain } from './rain.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundCanvas = document.createElement('canvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;

const gravity = 0.5;
const friction = 0.8;
const keys = {};

// Load sound effects
const soundCoin = new Audio('./sound/coin.wav');
const soundJump = new Audio('./sound/jump.wav');
const musicLevel = new Audio('./sound/level.mp3');

soundJump.volume = 0.5;

// Load background image
const backgroundImage = new Image();
backgroundImage.src = './assets/background.png';

const player = new Player(canvas.width / 2 - 16, canvas.height - 150); // Adjust width and height to match sprite frame size
const blocks = [
    new Block(200, canvas.height - 150, 100, 20),
    new Block(400, canvas.height -70, 100, 20),
    new Block(500, canvas.height -70, 100, 20),
    new Block(600, canvas.height -70, 100, 20),
    new Block(700, canvas.height -70, 100, 20),
    new Block(600, canvas.height - 250, 100, 20),

    new Block(900, canvas.height - 150, 100, 20),
    new Block(1100, canvas.height -70, 100, 20),
    new Block(1200, canvas.height -70, 100, 20),
    new Block(1400, canvas.height -150, 100, 20),
    new Block(1600, canvas.height -200, 100, 20),
    new Block(1800, canvas.height -300, 100, 20),
    new Block(1900, canvas.height -300, 100, 20),
    new Block(2000, canvas.height -300, 100, 20),

    new Block(2300, canvas.height -70, 100, 20),

    new Block(2500, canvas.height -70, 100, 20),

    new Block(2700, canvas.height -70, 100, 20),
    new Block(2800, canvas.height -70, 100, 20),
    new Block(2900, canvas.height -70, 100, 20),

    new Block(3000, canvas.height -70, 100, 20),
    new Block(3100, canvas.height -70, 100, 20),
    new Block(3100, canvas.height -280, 100, 20),
    new Block(3100, canvas.height -460, 100, 20),

    new Block(3200, canvas.height -70, 100, 20),

    new Block(3300, canvas.height -70, 100, 20),
    new Block(3300, canvas.height -190, 100, 20),
    new Block(3300, canvas.height -370, 100, 20),


];
const enemies = [
    new Enemy(0, canvas.height - 400, 64, 64, 2) // Adjusted size to match the new sprite
];
const nessie = new Nessie(-1000, canvas.height - 450, 800, 400, 3); // Nessie
const waterBlocks = [];
for (let i = 0; i < canvas.width * 2; i += 32) {
    waterBlocks.push(new Water(i, canvas.height - 60, 32, 20, 7, 0.02, '#0000FFDD')); // Higher and asymmetrical waves
}
const coins = [
    new Coin(50, canvas.height - 70, 16, 16), // Coin on the ground
    new Coin(250, canvas.height - 170, 16, 16), // Coin on the first platform
    new Coin(450, canvas.height - 220, 16, 16), // Coin on the second platform
    new Coin(650, canvas.height - 270, 16, 16) // Coin on the third platform
];

const rain = new Rain(canvas, 100); // Create rain effect with 100 drops

let scrollOffset = 0;
let scrollSpeed = 0;
let backgroundScrollOffset = 0;

function update(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

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
    backgroundScrollOffset += scrollSpeed * 0.25; // Parallax effect

    // Calculate scaling factor to maintain aspect ratio
    const scaleFactor = canvas.height / backgroundImage.height;
    const scaledWidth = backgroundImage.width * scaleFactor;

    // Draw background with parallax effect
    backgroundCtx.drawImage(backgroundImage, -backgroundScrollOffset % scaledWidth, 0, scaledWidth, canvas.height);
    backgroundCtx.drawImage(backgroundImage, -backgroundScrollOffset % scaledWidth + scaledWidth, 0, scaledWidth, canvas.height);

    // Draw background canvas to main canvas
    ctx.drawImage(backgroundCanvas, 0, 0);

    // Draw and update blocks
    blocks.forEach(block => {
        block.draw(ctx, scrollOffset);
    });

    // Check player collision with blocks
    player.checkCollision(blocks, scrollOffset);

    // Draw and update enemies
    enemies.forEach(enemy => {
        enemy.draw(ctx, scrollOffset);
        enemy.update(blocks, scrollOffset);
        // Check player collision with enemies
        enemy.checkCollision(player, scrollOffset);
    });

        // Draw player
        player.draw(ctx);


    // Draw and update coins
    coins.forEach(coin => {
        coin.draw(ctx, scrollOffset);
        if (coin.collect(player, scrollOffset)) {
            soundCoin.play();
            console.log('Coin collected!');
        }
    });

    // Draw and update Nessie
    nessie.draw(ctx, scrollOffset);
    nessie.update();
    // Check player collision with Nessie
    nessie.checkCollision(player, scrollOffset);


    // Draw water blocks
    waterBlocks.forEach(water => {
        water.draw(ctx, time);
    });

    // Update and draw rain
    rain.update();
    rain.draw();

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && player.grounded) {
        soundJump.play();
    }
    if(musicLevel.paused){
        //musicLevel.play();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

update();
