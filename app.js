const gameBoard = document.getElementById('game_board');
const context = gameBoard.getContext('2d');

let speed = 5;
let xVelocity = 0;
let yVelocity = 0;

let tileCount = 20;
let tileSize = gameBoard.width / tileCount; // 500 / 20 = 25px sized tiles

// object template for snake 'body parts' as they are added while ingame
class snakeBody {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let snakeHeadX = 5;
let snakeHeadY = 5;
const snakeBodyParts = [];
let tailLength = 1;

let appleX = 15;
let appleY = 15;

let score = 0;

document.body.addEventListener('keydown', keyPress);

// big poppa function
function gameState() {
    changeSnakePosition();
    let gameStop = gameOver();
    if (gameStop) { 
        return};
    resetGameBoard();
    drawSnake();
    drawApple();
    appleGet();
    tallyScore();
    setTimeout(gameState, 1000 / speed);
}

function gameOver() {
    let loseCondition = false;

    if (xVelocity === 0 && yVelocity === 0) {
        return false; // otherwise game is always on 'game over'
    }

    if (snakeHeadX < 0) {
        loseCondition = true;
    } else if (snakeHeadX === tileCount) {
        loseCondition = true;
    } else if (snakeHeadY < 0) {
        loseCondition = true;
    } else if (snakeHeadY === tileCount) {
        loseCondition = true;
    }
    // preventing the snake from going into itself
    for (let i = 0; i < snakeBodyParts.length; ++i) {
        let part = snakeBodyParts[i];
        if (part.x === snakeHeadX && part.y === snakeHeadY) {
            loseCondition = true;
            break;
        }
    }

    if (loseCondition) {
        context.fillStyle = 'purple';
        context.font = '40px Secular One';
        context.fillText('Game Over!', gameBoard.width / 4, gameBoard.height / 2);
    }
    return loseCondition;
}

function resetGameBoard() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, gameBoard.width, gameBoard.height);
}

function changeSnakePosition() {
    snakeHeadX = snakeHeadX + xVelocity;
    snakeHeadY = snakeHeadY + yVelocity;
}

function drawSnake() {
    // snake body
    context.fillStyle = 'green';
    for (let i = 0; i < snakeBodyParts.length; ++i) {
        let part = snakeBodyParts[i];
        context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    // using the class make new parts; the snake parts are pushed behind the head in 'reverse'; the shifted part is the tip of the tail as that is the newest element in the array
    snakeBodyParts.push(new snakeBody(snakeHeadX, snakeHeadY));
    if (snakeBodyParts.length > tailLength) {
        snakeBodyParts.shift();
    }
    // head of the snake is last to be drawn so it sits on 'top'
    context.fillStyle = 'gold';
    context.fillRect(snakeHeadX * tileCount, snakeHeadY * tileCount, tileSize, tileSize)
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function appleGet() {
    if (appleX === snakeHeadX && appleY == snakeHeadY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

function tallyScore() {
    context.fillStyle = 'white';
    context.font = '16px Secular One';
    context.fillText(`Score: ${score}`, gameBoard.width -70, 20);
}

// changing position based on the arrow keys; up=38 down=40 left=37 right=39
function keyPress(event) {
    if (event.keyCode == 38) {
        if (yVelocity == 1)
            return; //preventing the snake from moving into itself
        yVelocity = -1;
        xVelocity = 0;
    }
    if (event.keyCode == 40) {
        if (yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    if (event.keyCode == 37) {
        if (xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }
    if (event.keyCode == 39) {
        if (xVelocity == -1) 
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

gameState();