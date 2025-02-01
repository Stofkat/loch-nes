import { Player } from "./player.js";
import { Block } from "./block.js";
import { Enemy } from "./enemy.js";
import { Water } from "./water.js";
import { Coin } from "./coin.js";
import { Rain } from "./rain.js";
import { Explosion } from "./explosion.js";
import { StartScreen } from "./startScreen.js";
import { GameOverScreen } from "./gameOverScreen.js";
import { Treasure } from "./treasure.js";

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

let player = new Player(canvas.width / 2 - 16, canvas.height - 150);

let gameObjects = [];
let waterBlocks = [];

const createLevel = () => {
  gameObjects = [
    new Block(200, canvas.height - 150, 100, 150),
    new Block(400, canvas.height - 80, 100, 80),
    new Block(500, canvas.height - 80, 100, 80),
    new Block(600, canvas.height - 80, 100, 80),

    new Coin(640, canvas.height - 270, 16, 16),
    new Block(700, canvas.height - 80, 100, 80),
    new Block(800, canvas.height - 80, 100, 80),

    new Block(600, canvas.height - 250, 100, 50),

    new Block(900, canvas.height - 150, 100, 150),
    new Coin(940, canvas.height - 170, 16, 16),

    new Block(1100, canvas.height - 80, 100, 80),
    new Block(1200, canvas.height - 80, 100, 80),
    new Block(1300, canvas.height - 80, 100, 80),
    new Block(1400, canvas.height - 80, 100, 80),

    new Coin(1240, canvas.height - 100, 16, 16),
    new Block(1400, canvas.height - 150, 100, 150),
    new Coin(1440, canvas.height - 170, 16, 16),
    new Block(1500, canvas.height - 80, 100, 80),
    new Block(1600, canvas.height - 200, 100, 200),
    new Coin(1640, canvas.height - 220, 16, 16),

    new Block(1700, canvas.height - 80, 100, 80),
    new Block(1800, canvas.height - 300, 100, 300),
    new Coin(1840, canvas.height - 320, 16, 16),
    new Block(1900, canvas.height - 300, 100, 300),
    new Coin(1940, canvas.height - 320, 16, 16),
    new Block(2000, canvas.height - 300, 100, 300),
    new Coin(2040, canvas.height - 320, 16, 16),

    new Block(2300, canvas.height - 80, 100, 80),
    new Block(2400, canvas.height - 80, 100, 80),

    new Coin(2340, canvas.height - 100, 16, 16),
    new Block(2500, canvas.height - 80, 100, 80),
    new Coin(2540, canvas.height - 100, 16, 16),
    new Block(2600, canvas.height - 80, 100, 80),

    new Block(2700, canvas.height - 80, 100, 80),
    new Coin(2740, canvas.height - 100, 16, 16),
    new Block(2800, canvas.height - 80, 100, 80),
    new Block(2900, canvas.height - 80, 100, 80),
    new Coin(2940, canvas.height - 100, 16, 16),
    new Enemy(2800, canvas.height - 150),

    new Block(3000, canvas.height - 80, 100, 20),
    new Block(3100, canvas.height - 80, 100, 20),
    new Block(3100, canvas.height - 280, 100, 20),
    new Coin(3140, canvas.height - 300, 16, 16),

    new Block(3100, canvas.height - 460, 100, 20),
    new Coin(3140, canvas.height - 480, 16, 16),

    new Block(3200, canvas.height - 80, 100, 20),
    new Block(3300, canvas.height - 80, 100, 20),

    // The back and forth jumping blocks
    new Block(3300, canvas.height - 190, 100, 20),
    new Coin(3340, canvas.height - 210, 16, 16),
    new Block(3300, canvas.height - 370, 100, 20),
    new Block(3500, canvas.height - 370, 100, 20),
    new Coin(3540, canvas.height - 390, 16, 16),
    new Block(3600, canvas.height - 370, 100, 20),
    new Enemy(3600, canvas.height - 430),

    new Block(3700, canvas.height - 370, 100, 20),
    new Coin(3700, canvas.height - 390, 16, 16),

    new Block(4000, canvas.height - 150, 100, 150),
    new Coin(4040, canvas.height - 170, 16, 16),
    new Coin(4050, canvas.height - 210, 16, 16),

    // Large distance jump followed by many coins
    new Block(4100, canvas.height - 150, 100, 150),
    new Coin(4140, canvas.height - 170, 16, 16),
    new Coin(4155, canvas.height - 210, 16, 16),

    new Block(4200, canvas.height - 150, 100, 150),
    new Coin(4240, canvas.height - 170, 16, 16),
    new Coin(4255, canvas.height - 210, 16, 16),

    new Block(4300, canvas.height - 150, 100, 150),
    new Coin(4340, canvas.height - 170, 16, 16),
    new Coin(4355, canvas.height - 210, 16, 16),

    // Blocks with second enemy and treasure
    new Block(4600, canvas.height - 100, 100, 100),
    new Coin(4640, canvas.height - 120, 16, 16),
    new Block(4700, canvas.height - 100, 100, 100),
    new Block(4800, canvas.height - 100, 100, 100),
    new Coin(4840, canvas.height - 120, 16, 16),
    new Block(4900, canvas.height - 100, 100, 100),
    new Enemy(4800, canvas.height - 160),

    new Block(5000, canvas.height - 100, 100, 100),
    new Coin(5040, canvas.height - 120, 16, 16),

    // Nessie spawns after picking up the treasure
    new Treasure(5100, canvas.height - 150, 50, 50),

    // Some additional blocks for cinamatic effect
    new Block(5100, canvas.height - 100, 100, 100),
    new Block(5200, canvas.height - 100, 100, 100),
    new Block(5300, canvas.height - 100, 100, 100),
    new Block(5400, canvas.height - 100, 100, 100),
    new Block(5500, canvas.height - 100, 100, 100),

    // Easy hopping first session with Nessie

    new Block(5800, canvas.height - 100, 100, 100),
    new Block(5900, canvas.height - 100, 100, 100),

    new Block(6100, canvas.height - 100, 100, 100),
    new Block(6200, canvas.height - 100, 100, 100),

    new Block(6400, canvas.height - 100, 100, 100),
    new Block(6500, canvas.height - 100, 100, 100),

    // Increasing height of blocks
    new Block(6700, canvas.height - 100, 100, 100),
    new Block(6800, canvas.height - 100, 100, 100),
    new Block(6900, canvas.height - 100, 100, 100),
    new Block(7000, canvas.height - 200, 100, 200),
    new Block(7100, canvas.height - 150, 50, 150),
    new Block(7150, canvas.height - 100, 50, 100),
    new Block(7200, canvas.height - 100, 100, 100),
    new Block(7300, canvas.height - 300, 100, 300),
    new Block(7400, canvas.height - 150, 50, 150),
    new Block(7450, canvas.height - 100, 50, 100),
    new Block(7500, canvas.height - 100, 100, 100),
    new Block(7600, canvas.height - 400, 100, 400),

    // Leap of faith
    new Block(8000, canvas.height - 100, 100, 100),
    new Block(8100, canvas.height - 100, 100, 100),
    new Block(8100, canvas.height - 100, 100, 100),
    new Block(8200, canvas.height - 100, 100, 100),
    new Block(8300, canvas.height - 150, 100, 150),

    // Enemy hurdle
    new Block(8400, canvas.height - 100, 100, 100),
    new Enemy(8450, canvas.height - 160),
    new Block(8500, canvas.height - 100, 100, 100),
    new Enemy(8550, canvas.height - 160),
    new Block(8600, canvas.height - 100, 100, 100),
    new Enemy(8650, canvas.height - 160),
    new Block(8700, canvas.height - 100, 100, 100),
    new Enemy(8750, canvas.height - 160),
    new Block(8800, canvas.height - 100, 100, 100),
    new Enemy(8850, canvas.height - 160),
    new Block(8900, canvas.height - 100, 100, 100),
    new Block(9000, canvas.height - 100, 100, 100),

    new Block(9200, canvas.height - 100, 100, 100),

    new Block(9400, canvas.height - 150, 100, 100),

    new Block(9600, canvas.height - 200, 100, 100),

    new Block(9800, canvas.height - 250, 100, 100),


    // Finish!
    new Block(1000, canvas.height - 300, 100, 100),
    new Block(1100, canvas.height - 300, 100, 100),
    new Block(1200, canvas.height - 300, 100, 100),


  ];

  for (let i = 0; i < canvas.width * 2; i += 32) {
    waterBlocks.push(new Water(i, canvas.height - 60, 32, 20, 7, 0.02, "#3333FFCC"));
  }

  const rain = new Rain(canvas, 100); // create rain effect with 100 drops
  gameObjects.push(rain);
};

createLevel();

let scrollOffset = 0;
let scrollSpeed = 0;
let backgroundScrollOffset = 0;

const startScreen = new StartScreen(canvas, ctx);
const gameOverScreen = new GameOverScreen(canvas, ctx);

// Add these at the top with other constants
const GAME_STATE = {
  TITLE: "title",
  PLAYING: "playing",
  GAME_OVER: "gameOver",
  GAME_WON: "gameWon",
};

let gameState = GAME_STATE.TITLE;

// Add these constants at the top
const LOGIC_FPS = 60;
const LOGIC_TICK = 1000 / LOGIC_FPS;
let lastLogicUpdate = 0;
let lastRenderTime = 0;
let logicAccumulator = 0;

// Split update into render and logic functions
function gameLoop(currentTime) {
  // Convert to seconds
  const deltaTime = currentTime - lastRenderTime;
  lastRenderTime = currentTime;

  // Update logic accumulator
  logicAccumulator += deltaTime;

  // Run as many logic updates as needed to catch up
  while (logicAccumulator >= LOGIC_TICK) {
    updateLogic();
    logicAccumulator -= LOGIC_TICK;
  }

  // Render at whatever frame rate the browser provides
  render();

  requestAnimationFrame(gameLoop);
}

function updateLogic() {
  switch (gameState) {
    case GAME_STATE.PLAYING:
      if (player.isDead) {
        setTimeout(() => {
          gameState = GAME_STATE.GAME_OVER;
          musicLevel.pause();
          musicLevel.currentTime = 0;
          musicTitle.play();
        }, 1000);
        return;
      }

      // Update player position
      player.update(keys, gravity, canvas);

      // Update game objects
      gameObjects.forEach((obj, index) => {
        if (obj.update) obj.update(gameObjects, scrollOffset);

        // Remove dead enemies or expired explosions
        if (
          (obj instanceof Enemy && obj.shouldRemove()) ||
          (obj instanceof Explosion && !obj.isAlive())
        ) {
          gameObjects.splice(index, 1);
        }
      });

      // Check player collision with blocks
      const playerCollision = player.checkCollision(gameObjects, scrollOffset);

      // Update scroll position
      if (!playerCollision) {
        if (keys["ArrowRight"]) {
          scrollSpeed = player.speed;
        } else if (keys["ArrowLeft"]) {
          scrollSpeed = -player.speed;
        } else {
          scrollSpeed *= friction;
        }
      } else {
        scrollSpeed = -scrollSpeed;
      }

      scrollOffset += scrollSpeed;
      backgroundScrollOffset += scrollSpeed * 0.25;
      break;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  switch (gameState) {
    case GAME_STATE.TITLE:
      startScreen.draw();
      break;

    case GAME_STATE.PLAYING:
      // Draw background with parallax effect
      const scaleFactor = canvas.height / backgroundImage.height;
      const scaledWidth = backgroundImage.width * scaleFactor;

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

      ctx.drawImage(backgroundCanvas, 0, 0);

      // Draw player
      player.draw(ctx);

      // Draw game objects
      gameObjects.forEach((obj) => {
        obj.draw(ctx, scrollOffset);
      });

      // Draw water blocks
      waterBlocks.forEach((water) => {
        water.draw(ctx, performance.now());
      });

      // Draw score
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = "white";
      ctx.fillText(`Score: ${player.score}`, canvas.width - 200, 30);
      break;

    case GAME_STATE.GAME_OVER:
      gameOverScreen.draw(player.score);
      break;
  }
}

function startGame() {
  createLevel();
  gameState = GAME_STATE.PLAYING;
  player = new Player(canvas.width / 2 - 16, canvas.height - 150);
  scrollOffset = 0;
  scrollSpeed = 0;
  backgroundScrollOffset = 0;

  musicTitle.pause();
  musicTitle.currentTime = 0;
  musicLevel.play();
}

document.addEventListener("keydown", (e) => {
  if (gameState === GAME_STATE.TITLE) {
    startGame();
  } else if (gameState === GAME_STATE.GAME_OVER) {
    startGame();
  } else if (e.key === "Escape" && gameState === GAME_STATE.PLAYING) {
    gameState = GAME_STATE.PAUSED;
  } else if (e.key === "Escape" && gameState === GAME_STATE.PAUSED) {
    gameState = GAME_STATE.PLAYING;
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
  if (gameState === GAME_STATE.TITLE || gameState === GAME_STATE.GAME_OVER) {
    startGame();
    return;
  }
  keys[" "] = true;
  soundJump.play();
});

document.getElementById("buttonA").addEventListener("touchend", () => {
  if (gameState === GAME_STATE.TITLE || gameState === GAME_STATE.GAME_OVER) {
    startGame();
  }
  keys[" "] = false;
});

// Replace the original update() call with:
requestAnimationFrame(gameLoop);
