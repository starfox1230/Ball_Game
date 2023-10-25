const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playAgainButton = document.getElementById("playAgain");

canvas.width = 800;
canvas.height = 600;

let pinkBall;
let blueBalls;
let points;
let gameOver;
let explosionParticles;
const gravity = 0.1;

// Initialize game state
function initializeGame() {
  pinkBall = { x: 400, y: 300, r: 20 };
  blueBalls = [];
  points = 0;
  gameOver = false;
  explosionParticles = [];

  for (let i = 0; i < 50; i++) {
    blueBalls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 10,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1,
    });
  }
}

// Function to restart the game
function restartGame() {
  playAgainButton.classList.add("hidden");
  initializeGame();
}

function explode() {
  pinkBall.r = 0;
  for (let i = 0; i < 100; i++) {
    explosionParticles.push({
      x: pinkBall.x,
      y: pinkBall.y,
      dx: Math.random() * 6 - 3,
      dy: Math.random() * 6 - 3,
      r: 5,
    });
  }
}

function moveExplosionParticles() {
  explosionParticles.forEach((particle) => {
    particle.x += particle.dx;
    particle.y += particle.dy;
    particle.dy += gravity;

    if (particle.y + particle.r > canvas.height) {
      particle.y = canvas.height - particle.r;
      particle.dy *= -0.5;
    }
  });
}

function moveBlueBalls() {
  blueBalls.forEach((ball) => {
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.x < 0 || ball.x > canvas.width) {
      ball.dx = -ball.dx;
    }
    if (ball.y < 0 || ball.y > canvas.height) {
      ball.dy = -ball.dy;
    }
  });
}

function update(event) {
  if (!gameOver && event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    pinkBall.x = mouseX;
    pinkBall.y = mouseY;
  }

  moveBlueBalls();

  blueBalls = blueBalls.filter((ball) => {
    const dx = pinkBall.x - ball.x;
    const dy = pinkBall.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pinkBall.r + ball.r) {
      pinkBall.r += 1;
      return false;
    }
    return true;
  });

  if (blueBalls.length === 0 && !gameOver) {
    gameOver = true;
    explode();
    playAgainButton.classList.remove("hidden");
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (pinkBall.r > 0) {
    const r = 255;
    const g = 20;
    const b = pinkBall.r * 5;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.arc(pinkBall.x, pinkBall.y, pinkBall.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#87CEEB";
  blueBalls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (gameOver) {
    moveExplosionParticles();
    explosionParticles.forEach((particle) => {
      ctx.fillStyle = `rgb(${255}, ${20}, ${particle.y % 255})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = "48px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("You Won!", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Initialize game on first run
initializeGame();

// Add play again event listener
playAgainButton.addEventListener("click", restartGame);

// Main game loop
canvas.addEventListener("mousemove", update);
setInterval(() => {
  update();
  draw();
}, 16);
