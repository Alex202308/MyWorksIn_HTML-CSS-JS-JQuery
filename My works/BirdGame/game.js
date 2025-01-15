var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// Create image objects
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

// Set the values of source file for images
bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

// Create sound objects
var fly = new Audio();
var score_audio = new Audio();
var hit = new Audio();

// Set the values of source file for sounds
fly.src = "sound/fly.mp3";
score_audio.src = "sound/score.mp3";
hit.src = "sound/hit.mp3";

var gap = 100;

document.addEventListener("keydown", moveUp);

function moveUp() {
    if (!gameOver) {
        yPos -= 25;
        fly.play();
    }
}

var pipe = [];
pipe[0] = {
    x: cvs.width,
    y: 0
}

var score = 0;
var xPos = 10;
var yPos = 150;
var grav = 1;
var gameOver = false;

function showGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Verdana";
    ctx.fillText("Игра окончена!", cvs.width / 4, cvs.height / 2 - 20);
    ctx.fillText("Счет: " + score, cvs.width / 4, cvs.height / 2 + 20);
    
    // Создаем кнопку "Restart"
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Перезапустить';
    restartButton.style.position = 'absolute';
    restartButton.style.left = '80px';
    restartButton.style.top = '330px';
    
    restartButton.onclick = restartGame;
    document.body.appendChild(restartButton);
}

function restartGame() {
    score = 0;
    gameOver = false;
    yPos = 150; // Сброс позиции птицы
    pipe = [{ x: cvs.width, y: 0 }]; // Сброс труб
    document.body.removeChild(document.body.lastChild); // Удаляем кнопку
    draw(); // Начинаем игру заново
}

function draw() {
    ctx.drawImage(bg, 0, 0);
    
    for (var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
        
        pipe[i].x--;
        
        if (pipe[i].x == 100) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }
        
        if (xPos + bird.width >= pipe[i].x
            && xPos <= pipe[i].x + pipeUp.width
            && (yPos <= pipe[i].y + pipeUp.height
            || yPos + bird.height >= pipe[i].y + pipeUp.height + gap)
            || yPos + bird.height >= cvs.height - fg.height) {
            hit.play();
            gameOver = true; // Устанавливаем состояние игры в "окончена"
        }
        
        if (pipe[i].x == 5) {
            score++;
            score_audio.play();
        }
    }
    
    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);
    
    yPos += grav;

    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height - 20);

    // Проверка окончания игры
    if (gameOver) {
        showGameOverScreen(); // Показать экран завершения игры
        return; // Прекратить выполнение функции отрисовки
    }

    requestAnimationFrame(draw);
}

// Запускаем игру
pipeBottom.onload = draw;
