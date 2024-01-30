// Pong Wars clone
// inspired by pong-wars.vercel.app

const GRID_SIZE = 40;  //needs to be an even number
const OWNED_BY_PLAYER_ONE = 1;
const OWNED_BY_PLAYER_TWO = 2;
let grid;
let cellSize;
let playerOne;
let playerTwo;
let playerOneScore = GRID_SIZE * GRID_SIZE / 2;
let playerTwoScore = GRID_SIZE * GRID_SIZE / 2;
let playerOneScoreElement;
let playerTwoScoreElement;

function setup() {
  if (windowHeight > windowWidth) {
    cellSize = windowWidth*0.9/GRID_SIZE;
  }
  else {
    cellSize = windowHeight*0.9/GRID_SIZE;
  }
  createCanvas(cellSize*GRID_SIZE, cellSize*GRID_SIZE);
  grid = generateStartingGrid(GRID_SIZE, GRID_SIZE);

  playerOne = {
    x: width/4,
    y: height/2,
    dx: cellSize*GRID_SIZE/100,
    dy: cellSize*GRID_SIZE/100,
    score: 0,
    color: color(3, 4, 94),
    radius: cellSize*0.75,
  };

  playerTwo = {
    x: width/4 * 3,
    y: height/2,
    dx: -cellSize*GRID_SIZE/100,
    dy: -cellSize*GRID_SIZE/100,
    score: 0,
    color: color(144, 224, 239),
    radius: cellSize*0.75,
  };

  angleMode(DEGREES);

  playerOneScoreElement = createDiv(playerOneScore);
  playerTwoScoreElement = createDiv(playerTwoScore);

  setupScore();
}

function setupScore() {
  //get canvas location on page
  let canvasX = windowWidth/2 - width/2;
  let canvasY = windowHeight/2 - height/2;

  //set score elements locations to be beneath the canvas, and centered on the left and right sides of the canvas
  let playerOneScoreX = canvasX + width/4 * 3;
  let playerOneScoreY = canvasY + cellSize*GRID_SIZE + 2;

  let playerTwoScoreX = canvasX + width/4;
  let playerTwoScoreY = canvasY + cellSize*GRID_SIZE + 2;

  //create score elements
  playerOneScoreElement.position(playerOneScoreX, playerOneScoreY);
  playerOneScoreElement.style("color", "white");
  playerOneScoreElement.style("font-size", `${width/25}px`);
  playerOneScoreElement.style("font-family", "Arial");
  playerOneScoreElement.style("text-align", "center");

  playerTwoScoreElement.position(playerTwoScoreX, playerTwoScoreY);
  playerTwoScoreElement.style("color", "white");
  playerTwoScoreElement.style("font-size", `${width/25}px`);
  playerTwoScoreElement.style("font-family", "Arial");
  playerTwoScoreElement.style("text-align", "center");
}

function windowResized() {
  //recalculate cellSize and canvas size
  if (windowHeight > windowWidth) {
    cellSize = windowWidth*0.9/GRID_SIZE;
  }
  else {
    cellSize = windowHeight*0.9/GRID_SIZE;
  }
  resizeCanvas(cellSize*GRID_SIZE, cellSize*GRID_SIZE);

  //resize ball
  playerOne.radius = cellSize*0.75;
  playerTwo.radius = cellSize*0.75;

  //get vectors of ball speeds
  let playerOneSpeed = createVector(playerOne.dx, playerOne.dy);
  let playerTwoSpeed = createVector(playerTwo.dx, playerTwo.dy);
  
  //recalculate ball speeds
  playerOneSpeed.setMag(cellSize*GRID_SIZE/100);
  playerTwoSpeed.setMag(cellSize*GRID_SIZE/100);

  //set ball speeds
  playerOne.dx = playerOneSpeed.x;
  playerOne.dy = playerOneSpeed.y;
  playerTwo.dx = playerTwoSpeed.x;
  playerTwo.dy = playerTwoSpeed.y;

  setupScore();
}

function draw() {
  background(220);
  displayGrid();
  movePlayer(playerOne);
  movePlayer(playerTwo);
  displayPlayer(playerOne);
  displayPlayer(playerTwo);
  displayScore();
}

function displayScore() {
  //old method of displaying score, on the canvas
  // textSize(width/15);
  // textAlign(CENTER, CENTER);
  // fill(playerOne.color);
  // text(playerOneScore, width/12, height/12 * 11);
  // fill(playerTwo.color);
  // text(playerTwoScore, width/12 * 11, height/12 * 11);

  //new method of displaying score, on the page
  playerOneScoreElement.html(playerOneScore);
  playerTwoScoreElement.html(playerTwoScore);
}

function movePlayer(player) {
  player.x += player.dx;
  player.y += player.dy;

  //bounce off walls by reversing direction of dx or dy
  if (player.x - player.radius < 0 || player.x + player.radius > width) {
    player.dx *= -1;
    // keep player in bounds
    if (player.x - player.radius < 0) {
      player.x = player.radius;
    }
    if (player.x + player.radius > width) {
      player.x = width - player.radius;
    }
  }
  if (player.y - player.radius < 0 || player.y + player.radius > height) {
    player.dy *= -1;
    // keep player in bounds
    if (player.y - player.radius < 0) {
      player.y = player.radius;
    }
    if (player.y + player.radius > height) {
      player.y = height - player.radius;
    }
  }

  //repeat this for four points on the player's circle, top, bottom, left, right
  for (let angle = 0; angle < 360; angle += 45) {
    let x = player.x + player.radius * cos(angle);
    let y = player.y + player.radius * sin(angle);
    checkForCollision(player, x, y, angle);
  }
}

function checkForCollision(player, x, y, angle) {
  //check for collision with opposite color in grid
  let gridX = Math.floor(x / cellSize);
  let gridY = Math.floor(y / cellSize);
  
  //check if gridX and gridY are within the grid
  if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE &&
      (grid[gridY][gridX] === OWNED_BY_PLAYER_TWO && player.color === playerTwo.color ||
      grid[gridY][gridX] === OWNED_BY_PLAYER_ONE && player.color === playerOne.color)) {

    /// Moving more horizontally 
    if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
      player.dx = -player.dx;
    }
    // Moving more vertically
    else {
      player.dy = -player.dy;
    }

    player.dx += random(-0.1, 0.1);
    player.dy += random(-0.1, 0.1);

    //change grid ownership
    if (player.color === playerOne.color) {
      grid[gridY][gridX] = OWNED_BY_PLAYER_TWO;
      playerTwoScore++;
      playerOneScore--;
    }
    else {
      grid[gridY][gridX] = OWNED_BY_PLAYER_ONE;
      playerOneScore++;
      playerTwoScore--;
    }
  }
}

function displayPlayer(player) {
  fill(player.color);
  circle(player.x, player.y, player.radius*2);
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === OWNED_BY_PLAYER_ONE) {
        stroke(playerOne.color);
        fill(playerOne.color);
      }
      if (grid[y][x] === OWNED_BY_PLAYER_TWO) {
        stroke(playerTwo.color);
        fill(playerTwo.color);
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}


function generateStartingGrid(cols, rows) {
  let randomArray = [];
  for (let y = 0; y < cols; y++) {
    randomArray.push([]);
    for (let x = 0; x < rows; x++) {
      if (x < cols/2) {
        randomArray[y].push(OWNED_BY_PLAYER_TWO);
      }
      else {
        randomArray[y].push(OWNED_BY_PLAYER_ONE);
      }
    }
  }
  return randomArray;
}