const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Робот
const robot = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 7,
  dx: 0,
  dy: 0,
  bullets: []
};

// Корабли-враги
const enemies = [];
const enemySpeed = 3;

// Счет игрока
let score = 0;

// Управление движением робота
function moveRobot() {
  robot.x += robot.dx;
  robot.y += robot.dy;

  // Ограничение движения робота в границах холста
  if (robot.x < 0) robot.x = 0;
  if (robot.x + robot.width > canvas.width) robot.x = canvas.width - robot.width;
  if (robot.y < 0) robot.y = 0;
  if (robot.y + robot.height > canvas.height) robot.y = canvas.height - robot.height;
}

// Отрисовка робота
function drawRobot() {
  ctx.fillStyle = 'green';
  ctx.fillRect(robot.x, robot.y, robot.width, robot.height);
}

// Отрисовка пуль
function drawBullets() {
  ctx.fillStyle = 'yellow';
  robot.bullets.forEach((bullet, bulletIndex) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y -= bullet.speed;

    // Удаление пули, если она выходит за пределы экрана
    if (bullet.y < 0) {
      robot.bullets.splice(bulletIndex, 1);
    }

    // Проверка столкновения пуль с врагами
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y) {
        
        // Удаляем пулю и врага при столкновении
        robot.bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);

        // Увеличиваем счет
        score += 1;
      }
    });
  });
}

// Стрельба пулями
function shoot() {
  robot.bullets.push({
    x: robot.x + robot.width / 2 - 2.5,
    y: robot.y,
    width: 5,
    height: 20,
    speed: 8
  });
}

// Генерация врагов
function spawnEnemies() {
  const enemySize = 50;
  const x = Math.random() * (canvas.width - enemySize);
  enemies.push({
    x: x,
    y: -enemySize,
    width: enemySize,
    height: enemySize,
    speed: enemySpeed
  });
}

// Отрисовка врагов
function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach((enemy, index) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;

    // Удаление врагов, если они выходят за экран
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// Отображение счета
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

// Обновление игры
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveRobot();
  drawRobot();
  drawBullets();
  drawEnemies();
  drawScore();

  requestAnimationFrame(update);
}

// Начало игры
function startGame() {
  update();
  setInterval(spawnEnemies, 1000); // Спавн врагов каждые 1 сек
}

// Управление клавишами
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') robot.dx = robot.speed;
  if (e.key === 'ArrowLeft') robot.dx = -robot.speed;
  if (e.key === 'ArrowUp') robot.dy = -robot.speed;
  if (e.key === 'ArrowDown') robot.dy = robot.speed;
  if (e.key === ' ') shoot(); // Пробел для стрельбы
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') robot.dx = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') robot.dy = 0;
});

startGame();
