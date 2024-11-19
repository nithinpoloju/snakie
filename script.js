const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');

canvas.width = 400;
canvas.height = 400;

const boxSize = 20; // Size of each box in the grid
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let gameInterval;
let score = 0;
let speed = 100;

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw the head as a triangle
      ctx.beginPath();
      const centerX = segment.x + boxSize / 2;
      const centerY = segment.y + boxSize / 2;

      if (direction.x === boxSize) {
        // Facing right
        ctx.moveTo(segment.x, segment.y);
        ctx.lineTo(segment.x, segment.y + boxSize);
        ctx.lineTo(segment.x + boxSize, centerY);
      } else if (direction.x === -boxSize) {
        // Facing left
        ctx.moveTo(segment.x + boxSize, segment.y);
        ctx.lineTo(segment.x + boxSize, segment.y + boxSize);
        ctx.lineTo(segment.x, centerY);
      } else if (direction.y === boxSize) {
        // Facing down
        ctx.moveTo(segment.x, segment.y);
        ctx.lineTo(segment.x + boxSize, segment.y);
        ctx.lineTo(centerX, segment.y + boxSize);
      } else if (direction.y === -boxSize) {
        // Facing up
        ctx.moveTo(segment.x, segment.y + boxSize);
        ctx.lineTo(segment.x + boxSize, segment.y + boxSize);
        ctx.lineTo(centerX, segment.y);
      } else {
        // Default direction (right)
        ctx.moveTo(segment.x, segment.y);
        ctx.lineTo(segment.x, segment.y + boxSize);
        ctx.lineTo(segment.x + boxSize, centerY);
      }

      ctx.fillStyle = '#ffff00'; // Head is yellow
      ctx.fill();
      ctx.closePath();
    } else {
      // Draw body as a circle
      ctx.beginPath();
      ctx.arc(
        segment.x + boxSize / 2,
        segment.y + boxSize / 2,
        boxSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#32cd32'; // Body is green
      ctx.fill();
      ctx.strokeStyle = '#006400'; // Dark green border
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }
  });
}

function drawFood() {
  ctx.beginPath();
  ctx.arc(
    food.x + boxSize / 2,
    food.y + boxSize / 2,
    boxSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = '#ff4500'; // Food is orange
  ctx.fill();
  ctx.strokeStyle = '#ff6347'; // Slightly darker border
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function randomFood() {
  food.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
  food.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap around the canvas borders
  if (head.x < 0) head.x = canvas.width - boxSize;
  if (head.y < 0) head.y = canvas.height - boxSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    randomFood();
  } else {
    snake.pop(); // Remove tail if no food is eaten
  }
}

function checkCollision() {
  const head = snake[0];

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function gameLoop() {
  if (checkCollision()) {
    clearInterval(gameInterval);
    alert(`Game Over! Final Score: ${score}`);
    resetGame();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  randomFood();
}

function changeDirection(event) {
  const key = event.key;
  const goingUp = direction.y === -boxSize;
  const goingDown = direction.y === boxSize;
  const goingLeft = direction.x === -boxSize;
  const goingRight = direction.x === boxSize;

  if (key === 'ArrowUp' && !goingDown) {
    direction = { x: 0, y: -boxSize };
  } else if (key === 'ArrowDown' && !goingUp) {
    direction = { x: 0, y: boxSize };
  } else if (key === 'ArrowLeft' && !goingRight) {
    direction = { x: -boxSize, y: 0 };
  } else if (key === 'ArrowRight' && !goingLeft) {
    direction = { x: boxSize, y: 0 };
  }
}

function startGame() {
  speed = parseInt(difficultySelect.value);
  resetGame();
  randomFood();
  gameInterval = setInterval(gameLoop, speed);
}

// Event listeners
document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
