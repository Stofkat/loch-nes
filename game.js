import { Player } from "./player.js";
import { Block } from "./block.js";
import { Enemy } from "./enemy.js";
import { Water } from "./water.js";
import { Coin } from "./coin.js";
import { Nessie } from "./nessie.js";
import { Rain } from "./rain.js";
import { Explosion } from "./explosion.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundCanvas = document.createElement("canvas");
const backgroundCtx = backgroundCanvas.getContext("2d");
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;

const gravity = 0.5;
const friction = 0.8;
const keys = {};

// Load sound effects
const soundJump = new Audio("./sound/jump.wav");
const musicLevel = new Audio("./sound/level.mp3");
const musicTitle = new Audio("./sound/title.mp3");
musicTitle.play();
musicTitle.loop = true;

soundJump.volume = 0.3;

// Load background image
const backgroundImage = new Image();
backgroundImage.src = "./assets/background.png";

// Load start screen background image
const startScreenImage = new Image();
startScreenImage.src = "./assets/title1.png";

const player = new Player(canvas.width / 2 - 16, canvas.height - 150); // Adjust width and height to match sprite frame size

const gameObjects = [
  new Block(200, canvas.height - 150, 100, 150),
  new Block(400, canvas.height - 80, 100, 80),
  new Block(500, canvas.height - 80, 100, 80),
  new Block(600, canvas.height - 80, 100, 80),
  new Coin(600, canvas.height - 100, 16, 16),
  new Block(700, canvas.height - 80, 100, 80),
  new Block(600, canvas.height - 250, 100, 50),

  new Block(900, canvas.height - 150, 100, 150),
  new Coin(900, canvas.height - 170, 16, 16),

  new Block(1100, canvas.height - 80, 100, 80),
  new Block(1200, canvas.height - 80, 100, 80),
  new Coin(1200, canvas.height - 100, 16, 16),
  new Block(1400, canvas.height - 150, 100, 150),
  new Coin(1400, canvas.height - 170, 16, 16),

  new Block(1600, canvas.height - 200, 100, 200),
  new Block(1800, canvas.height - 300, 100, 300),
  new Block(1900, canvas.height - 300, 100, 300),
  new Block(2000, canvas.height - 300, 100, 300),

  new Block(2300, canvas.height - 80, 100, 80),
  new Block(2500, canvas.height - 80, 100, 80),

  new Block(2700, canvas.height - 80, 100, 80),
  new Block(2800, canvas.height - 80, 100, 80),
  new Block(2900, canvas.height - 80, 100, 80),

  new Block(3000, canvas.height - 80, 100, 20),
  new Block(3100, canvas.height - 80, 100, 20),
  new Block(3100, canvas.height - 280, 100, 20),
  new Block(3100, canvas.height - 460, 100, 20),

  new Block(3200, canvas.height - 80, 100, 20),

  new Block(3300, canvas.height - 80, 100, 20),
  new Block(3300, canvas.height - 190, 100, 20),

  new Block(3300, canvas.height - 370, 100, 20),
  new Block(3500, canvas.height - 370, 100, 20),
  new Block(3600, canvas.height - 370, 100, 20),
  new Enemy(3600, canvas.height - 430),

  new Block(3700, canvas.height - 370, 100, 20),

  new Block(4100, canvas.height - 150, 100, 20),
  new Block(4200, canvas.height - 150, 100, 20),
  new Block(4300, canvas.height - 150, 100, 20),

  new Block(4600, canvas.height - 100, 100, 20),
  new Block(4700, canvas.height - 100, 100, 20),
  new Block(4800, canvas.height - 100, 100, 20),
  new Block(4900, canvas.height - 100, 100, 20),
  new Enemy(4800, canvas.height - 160),

  new Block(5000, canvas.height - 100, 100, 20),

  new Nessie(-1000, canvas.height - 400, 800, 400, 3), // Nessie
];

const waterBlocks = [];
for (let i = 0; i < canvas.width * 2; i += 32) {
  waterBlocks.push(new Water(i, canvas.height - 60, 32, 20, 7, 0.02, "#3333FFCC"));
}

const rain = new Rain(canvas, 100); // Create rain effect with 100 drops
gameObjects.push(rain);

let scrollOffset = 0;
let scrollSpeed = 0;
let backgroundScrollOffset = 0;
let gameStarted = false; // Track if the game has started

let pulseDirection = 1;
const pulseSpeed = 0.01; // Reduce the speed to half

let pulseAlpha = 1;
pulseDirection = -1;
const minAlpha = 0.3;
const maxAlpha = 1;

function drawTextWithOutline(text, x, y, fontSize) {
  ctx.font = `${fontSize}px "Press Start 2P"`; // Use 8-bit font
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
}

function startScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height); // Draw scenic background

  // Draw title with outline
  drawTextWithOutline("Loch NES", canvas.width / 2, canvas.height / 2 - 100, 50);

  drawTextWithOutline("The Adventures of Judith", canvas.width / 2, canvas.height / 2 - 50, 30);

  // Draw pulsing "Press any key to start" text with outline
  ctx.save();
  ctx.globalAlpha = pulseAlpha;
  ctx.translate(canvas.width / 2, canvas.height / 2 + 100);
  drawTextWithOutline("Press any key to start", 0, 0, 20);
  ctx.restore();

  // Update pulse alpha
  pulseAlpha += pulseSpeed * pulseDirection;
  if (pulseAlpha > maxAlpha || pulseAlpha < minAlpha) {
    pulseDirection *= -1;
  }

  requestAnimationFrame(startScreen);
}

function update(time) {
  if (!gameStarted) {
    startScreen();
    return;
  }

  // Check for game over state
  if (player.isDead) {
    gameStarted = false;
    musicLevel.pause();
    musicLevel.currentTime = 0;
    musicTitle.play();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  // Update player position
  player.update(keys, gravity, canvas);

  // Calculate scaling factor to maintain aspect ratio
  const scaleFactor = canvas.height / backgroundImage.height;
  const scaledWidth = backgroundImage.width * scaleFactor;

  // Draw background with parallax effect
  backgroundCtx.drawImage(
    backgroundImage,
    -backgroundScrollOffset % scaledWidth,
    0,
    scaledWidth,
    canvas.height
  );
  backgroundCtx.drawImage(
    backgroundImage,
    (-backgroundScrollOffset % scaledWidth) + scaledWidth,
    0,
    scaledWidth,
    canvas.height
  );

  // Draw background canvas to main canvas
  ctx.drawImage(backgroundCanvas, 0, 0);

  // Draw player
  player.draw(ctx);

  // Draw and update all game objects
  gameObjects.forEach((obj, index) => {
    obj.draw(ctx, scrollOffset, gameObjects);
    if (obj.update) obj.update(gameObjects, scrollOffset);

    // Remove explosion after animation
    if (obj instanceof Explosion && !obj.isAlive()) {
      gameObjects.splice(index, 1);
    }
  });

  // Check player collision with blocks
  const playerCollision = player.checkCollision(gameObjects, scrollOffset);

  waterBlocks.forEach((water) => {
    water.draw(ctx, time);
  });

  // Scroll the world
  if (!playerCollision) {
    if (keys["ArrowRight"]) {
      scrollSpeed = player.speed;
    } else if (keys["ArrowLeft"]) {
      scrollSpeed = -player.speed;
    } else {
      scrollSpeed *= friction; // Apply friction to the scroll speed
    }
  } else {
    scrollSpeed = -scrollSpeed;
  }

  scrollOffset += scrollSpeed;
  backgroundScrollOffset += scrollSpeed * 0.25; // Parallax effect

  // Draw score
  ctx.font = '20px "Press Start 2P"'; // Use 8-bit font
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${player.score}`, canvas.width - 200, 30);

  requestAnimationFrame(update);
}

function startGame() {
  gameStarted = true;
  musicTitle.pause();
  musicTitle.currentTime = 0;
  musicLevel.play();
  update();
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    startGame();
  }
  keys[e.key] = true;
  if (e.key === " " && player.grounded) {
    soundJump.play();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.getElementById("left").addEventListener("touchstart", () => {
  keys["ArrowLeft"] = true;
});
document.getElementById("left").addEventListener("touchend", () => {
  keys["ArrowLeft"] = false;
});

document.getElementById("right").addEventListener("touchstart", () => {
  keys["ArrowRight"] = true;
});
document.getElementById("right").addEventListener("touchend", () => {
  keys["ArrowRight"] = false;
});

document.getElementById("buttonA").addEventListener("touchstart", () => {
  if (player.grounded) {
    keys[" "] = true;
    soundJump.play();
  }
});
document.getElementById("buttonA").addEventListener("touchend", () => {
  if (!gameStarted) {
    startGame();
  }
  keys[" "] = false;
});

startScreen(); // Show start screen initially
