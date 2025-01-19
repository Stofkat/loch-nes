import { Player } from "./player.js";
import { Block } from "./block.js";
import { Enemy } from "./enemy.js";
import { Water } from "./water.js";
import { Coin } from "./coin.js";
import { Nessie } from "./nessie.js";
import { Rain } from "./rain.js";

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

soundJump.volume = 0.3;

// Load background image
const backgroundImage = new Image();
backgroundImage.src = "./assets/background.png";

// Load start screen background image
const startScreenImage = new Image();
startScreenImage.src = "./assets/title1.png";

const player = new Player(canvas.width / 2 - 16, canvas.height - 150); // Adjust width and height to match sprite frame size

const gameObjects = [
  new Nessie(-1000, canvas.height - 450, 800, 400, 3), // Nessie
  new Block(200, canvas.height - 150, 100, 20),
  new Block(400, canvas.height - 70, 100, 20),
  new Block(500, canvas.height - 70, 100, 20),
  new Block(600, canvas.height - 70, 100, 20),
  new Block(700, canvas.height - 70, 100, 20),
  new Block(600, canvas.height - 250, 100, 20),

  new Block(900, canvas.height - 150, 100, 20),
  new Block(1100, canvas.height - 70, 100, 20),
  new Block(1200, canvas.height - 70, 100, 20),
  new Block(1400, canvas.height - 150, 100, 20),
  new Block(1600, canvas.height - 200, 100, 20),
  new Block(1800, canvas.height - 300, 100, 20),
  new Block(1900, canvas.height - 300, 100, 20),
  new Block(2000, canvas.height - 300, 100, 20),
  new Enemy(0, canvas.height - 400, 64, 64, 2), // Adjusted size to match the new sprite

  new Block(2300, canvas.height - 70, 100, 20),

  new Block(2500, canvas.height - 70, 100, 20),

  new Block(2700, canvas.height - 70, 100, 20),
  new Block(2800, canvas.height - 70, 100, 20),
  new Block(2900, canvas.height - 70, 100, 20),

  new Block(3000, canvas.height - 70, 100, 20),
  new Block(3100, canvas.height - 70, 100, 20),
  new Block(3100, canvas.height - 280, 100, 20),
  new Block(3100, canvas.height - 460, 100, 20),

  new Block(3200, canvas.height - 70, 100, 20),

  new Block(3300, canvas.height - 70, 100, 20),
  new Block(3300, canvas.height - 190, 100, 20),
  new Block(3300, canvas.height - 370, 100, 20),

  new Block(3500, canvas.height - 370, 100, 20),



  new Coin(50, canvas.height - 70, 16, 16), // Coin on the ground
  new Coin(250, canvas.height - 170, 16, 16), // Coin on the first platform
  new Coin(450, canvas.height - 220, 16, 16), // Coin on the second platform
  new Coin(650, canvas.height - 270, 16, 16), // Coin on the third platform
];

const waterBlocks = [];
for (let i = 0; i < canvas.width * 2; i += 32) {
  waterBlocks.push(new Water(i, canvas.height - 60, 32, 20, 7, 0.02, "#3333FFCC")); // Higher and asymmetrical waves
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

let touchStartX = 0;
let touchStartY = 0;

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

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  // Update player position
  player.update(keys, gravity, canvas);

  // Scroll the world
  if (keys["ArrowRight"]) {
    scrollSpeed = player.speed;
  } else if (keys["ArrowLeft"]) {
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
  gameObjects.forEach((obj) => {
    obj.draw(ctx, scrollOffset);
    if (obj.update) obj.update(gameObjects, scrollOffset);
  });

  // Check player collision with blocks
  player.checkCollision(gameObjects, scrollOffset);

  waterBlocks.forEach((water) => {
    water.draw(ctx, time);
  });

  // Draw score
  ctx.font = '20px "Press Start 2P"'; // Use 8-bit font
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${player.score}`, canvas.width - 200, 30);

  requestAnimationFrame(update);

}

function handleTouchStart(event) {

  const firstTouch = event.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

function requestFullScreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) { // Firefox
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) { // IE/Edge
    canvas.msRequestFullscreen();
  }
}

function handleTouchEnd(event) {
  if (!gameStarted) {
    gameStarted = true;
    musicLevel.play();
    update();
    requestFullScreen(); // Request full screen when the game starts
  }

  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (diffX > 50) {
    keys["ArrowRight"] = true;
    keys["ArrowLeft"] = false;
  } else if (diffX < -50) {
    keys["ArrowRight"] = false;
    keys["ArrowLeft"] = true;
  } 
  if (diffY < -50) {
    if (player.grounded) {
      keys[" "] = true;
      soundJump.play();
    }
  } 
  if(diffX === 0 && diffY === 0) {
    // Tapping stops all movement
    keys["ArrowRight"] = false;
    keys["ArrowLeft"] = false;
    keys[" "] = false;
  }

  // Reset jump key after handling touch end
  setTimeout(() => {
    keys[" "] = false;
  }, 100);
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    gameStarted = true;
    musicLevel.play();
    update();
  }
  keys[e.key] = true;
  if (e.key === " " && player.grounded) {
    soundJump.play();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchend", handleTouchEnd, false);

startScreen(); // Show start screen initially
