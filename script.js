const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Assets ---
const playerImage = new Image();
playerImage.src = 'assets/player.png';

const enemyImage = new Image();
enemyImage.src = 'assets/enemy.png';

// --- Jugador ---
const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height - 50,
    width: 32,
    height: 32,
    speed: 5
};

const keys = {};
let spaceHold = false;

// --- Disparos del Jugador ---
const playerProjectiles = [];
const projectileSpeed = -10;
const projectileWidth = 4;
const projectileHeight = 10;
const projectileColor = 'lime';

// --- Enemigos ---
const enemies = [];
const enemyWidth = 32;
const enemyHeight = 32;
const enemySpeedXRandom = 0.5;
const enemySpeedYRandom = 0.5;
let enemySpawnTimer = 0;
const enemySpawnInterval = 120;

function spawnEnemyGroup() {
    console.log("¡Generando un nuevo grupo de enemigos!");
    for (let i = 0; i < 3; i++) {
        const randomX = Math.random() * (canvas.width - enemyWidth);
        const randomY = Math.random() * (canvas.height * 0.3);
        const speedX = (Math.random() - 0.5) * 2 * enemySpeedXRandom;
        const speedY = Math.random() * enemySpeedYRandom;

        enemies.push({
            x: randomX,
            y: randomY,
            width: enemyWidth,
            height: enemyHeight,
            alive: true,
            speedX: speedX,
            speedY: speedY
        });
    }
}

function updateEnemies() {
    console.log("Entrando a updateEnemies()");
    console.log("Estado de enemies al entrar:", enemies);
    if (enemies.length > 0) { // Añadimos esta condición
        for (const enemy of enemies) {
            if (enemy.alive) {
                enemy.x += enemy.speedX;
                enemy.y += enemy.speedY;

                if (enemy.x < 0 || enemy.x + enemyWidth > canvas.width) {
                    enemy.speedX *= -1;
                }
                if (enemy.y > canvas.height) {
                    enemy.alive = false;
                }
            }
        }
    }
    console.log("Antes del filtro. Longitud de enemies:", enemies.length);
    enemies = enemies.filter(enemy => enemy.alive);
    console.log("Después del filtro. Nueva longitud de enemies:", enemies.length);
    console.log("Saliendo de updateEnemies()");
}

function drawEnemies() {
    for (const enemy of enemies) {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}

// --- Event Listeners ---
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && !spaceHold) {
        shoot();
        spaceHold = true;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') {
        spaceHold = false;
    }
});

// --- Funciones de Disparo ---
function shoot() {
    const newProjectile = {
        x: player.x + player.width / 2 - projectileWidth / 2,
        y: player.y,
        width: projectileWidth,
        height: projectileHeight,
        color: projectileColor,
        speedY: projectileSpeed
    };
    playerProjectiles.push(newProjectile);
}

// --- Detección de Colisiones ---
function checkCollision(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

function handleCollisions() {
    for (let i = 0; i < playerProjectiles.length; i++) {
        const projectile = playerProjectiles[i];
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (enemy.alive && checkCollision(projectile, enemy)) {
                enemy.alive = false;
                playerProjectiles.splice(i, 1);
                i--;
                break;
            }
        }
    }

    for (let i = 0; i < enemies.length; i++) { // Usamos índice para poder eliminar
        const enemy = enemies[i];
        if (enemy.alive && checkCollision(enemy, player)) {
            console.log("¡Colisión con el jugador!");
            enemies.splice(i, 1); // Eliminar al enemigo al colisionar con el jugador
            i--;
            // Aquí iría la lógica para la pérdida de vidas, fin del juego, etc.
        }
    }
}

// --- Bucle del Juego ---
function update() {
    console.log("Función update() ejecutándose");
    // Movimiento del jugador
    if (keys['ArrowLeft'] || keys['a']) {
        player.x -= player.speed;
        if (player.x < 0) {
            player.x = 0;
        }
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x += player.speed;
        if (player.x > canvas.width - player.width) {
            player.x = canvas.width - player.width;
        }
    }

    // Actualizar la posición de los disparos
   for (let i = 0; i < playerProjectiles.length; i++) {
        playerProjectiles[i].y += playerProjectiles[i].speedY;
        if (playerProjectiles[i].y < 0) {
            playerProjectiles.splice(i, 1);
            i--;
        }
    }

    // Generar nuevos enemigos
    enemySpawnTimer++;
    if (enemySpawnTimer >= enemySpawnInterval) {
        spawnEnemyGroup();
        enemySpawnTimer = 0;
    }

    // Actualizar la posición de los enemigos
     updateEnemies();

    // Comprobar colisiones
    handleCollisions();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar al jugador
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Dibujar los disparos
    ctx.fillStyle = projectileColor;
    for (const projectile of playerProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }

    // Dibujar los enemigos
    drawEnemies();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Inicialización ---
gameLoop();