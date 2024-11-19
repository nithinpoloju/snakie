// Setup canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set up initial game state variables
let gridSize = 20; // Default grid size
let canvasWidth, canvasHeight; // Dynamic canvas width and height
let snake = [{ x: 200, y: 200 }]; // Snake body
let snakeDirection = { x: 1, y: 0 }; // Direction snake is moving
let food = { x: 0, y: 0 }; // Food position
let score = 0; // Player's score
let gameInterval;
let gameSpeed = 100; // Speed of the game, controls the snake's movement
let difficulty = 'medium'; // Default difficulty

// Adjust canvas size based on window size
function adjustCanvasSize() {
    canvasWidth = window.innerWidth * 0.8; // 80% of window width
    canvasHeight = window.innerHeight * 0.8; // 80% of window height
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

// Generate random position for food within the canvas boundaries
function generateFood() {
    // Ensure food is placed within the canvas grid
    food.x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;

    // Prevent food from overlapping the snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood(); // Recurse if food overlaps with the snake
        }
    });
}

// Draw the snake, food, and boundaries
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each frame

    // Draw boundaries (outline) with a thicker white line
    ctx.strokeStyle = "#FF5733"; // Bright color for boundary
    ctx.lineWidth = 6; // Thicker line for visibility
    ctx.strokeRect(0, 0, canvas.width, canvas.height); // Canvas boundaries

    // Draw snake
    ctx.fillStyle = "#4CAF50"; // Snake color
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize); // Draw snake segment
    });

    // Draw food
    ctx.fillStyle = "#FF5733"; // Food color
    ctx.fillRect(food.x, food.y, gridSize, gridSize); // Draw food

    // Draw score
    document.getElementById("score").innerText = score;
}

// Update the snake's position based on direction
function updateSnake() {
    const head = { ...snake[0] }; // Copy the snake's head to move it
    head.x += snakeDirection.x * gridSize;
    head.y += snakeDirection.y * gridSize;
    snake.unshift(head); // Add new head to the front of the snake
    if (head.x === food.x && head.y === food.y) {
        score += 10; // Increase score when food is eaten
        generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove last segment if food is not eaten
    }
}

// Handle key presses for controlling the snake's direction
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && snakeDirection.y !== 1) {
        snakeDirection = { x: 0, y: -1 };
    } else if (e.key === "ArrowDown" && snakeDirection.y !== -1) {
        snakeDirection = { x: 0, y: 1 };
    } else if (e.key === "ArrowLeft" && snakeDirection.x !== 1) {
        snakeDirection = { x: -1, y: 0 };
    } else if (e.key === "ArrowRight" && snakeDirection.x !== -1) {
        snakeDirection = { x: 1, y: 0 };
    }
});

// Check for collisions with the boundaries or the snake's body
function checkCollisions() {
    const head = snake[0];
    // Collision with boundaries (left, right, top, bottom)
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        return true; // Collided with wall
    }
    // Collision with the snake's body
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Collided with itself
        }
    }
    return false;
}

// Game loop to update the game state
function gameLoop() {
    updateSnake();
    if (checkCollisions()) {
        clearInterval(gameInterval); // Stop the game if collision occurs
        alert("Game Over! Your score: " + score);
        score = 0;
        snake = [{ x: 200, y: 200 }];
        snakeDirection = { x: 1, y: 0 };
        generateFood();
        return;
    }
    drawGame();
}

// Start the game
function startGame() {
    adjustCanvasSize(); // Adjust canvas size when starting the game
    generateFood();
    gameInterval = setInterval(gameLoop, gameSpeed); // Game loop with specified speed
}

// Set difficulty level
function setDifficulty(level) {
    switch (level) {
        case 'easy':
            gridSize = 25;
            gameSpeed = 150;
            break;
        case 'medium':
            gridSize = 20;
            gameSpeed = 100;
            break;
        case 'hard':
            gridSize = 15;
            gameSpeed = 70;
            break;
        default:
            gameSpeed = 100;
            gridSize = 20;
            break;
    }
}

// Handle the start button click
document.getElementById("startBtn").addEventListener("click", () => {
    const selectedDifficulty = document.getElementById("difficulty").value;
    setDifficulty(selectedDifficulty);
    startGame();
});

// Adjust canvas size when the window is resized
window.addEventListener("resize", adjustCanvasSize);
