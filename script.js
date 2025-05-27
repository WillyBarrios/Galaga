const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estados del juego
const GAME_STATE = {
    MENU: 'menu',
    CREDITS: 'credits',
    PLAYING: 'playing'
};
let currentGameState = GAME_STATE.MENU;

// --- Assets ---
const playerImage = new Image();
playerImage.src = 'assets/player.png';

const enemyImage = new Image();
enemyImage.src = 'assets/enemy.png';
playerImage.onload = () => {
    console.log("Imagen del jugador cargada correctamente.");
};

enemyImage.onload = () => {
    console.log("Imagen del enemigo cargada correctamente.");
};

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Llamar la función al inicio
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
let enemies = [];
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
    if (enemies.length > 0) { // 
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
// Función para dibujar el menú principal
function drawMainMenu() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GALAGA', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '24px Arial';
    ctx.fillText('Presiona ESPACIO para comenzar', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Presiona C para ver los créditos', canvas.width / 2, canvas.height / 2 + 40);
    
    // Agregar los botones táctiles
    // Botón de Inicio
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.6, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('INICIAR JUEGO', canvas.width / 2, canvas.height * 0.6 + 35);

    // Botón de Créditos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.7, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('CRÉDITOS', canvas.width / 2, canvas.height * 0.7 + 35);
}

// Agregar manejo táctil para el botón de retorno en créditos
// Modificar el event listener de touchstart para incluir los botones del menú
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    if (currentGameState === GAME_STATE.MENU) {
        // Verificar toque en botón de inicio
        if (touchX >= canvas.width / 4 && 
            touchX <= canvas.width * 3 / 4 &&
            touchY >= canvas.height * 0.6 &&
            touchY <= canvas.height * 0.6 + 50) {
            currentGameState = GAME_STATE.PLAYING;
            // Reiniciar variables del juego
            enemies = [];
            playerProjectiles = [];
            enemyProjectiles = [];
            enemySpawnTimer = 0;
            gameTime = 0;
            player.x = canvas.width / 2 - player.width / 2;
        }
        // Verificar toque en botón de créditos
        else if (touchX >= canvas.width / 4 && 
                 touchX <= canvas.width * 3 / 4 &&
                 touchY >= canvas.height * 0.7 &&
                 touchY <= canvas.height * 0.7 + 50) {
            currentGameState = GAME_STATE.CREDITS;
        }
    } else if (currentGameState === GAME_STATE.CREDITS) {
        // Verificar toque en botón de retorno
        if (touchX >= canvas.width / 4 && 
            touchX <= canvas.width * 3 / 4 &&
            touchY >= canvas.height * 0.8 &&
            touchY <= canvas.height * 0.8 + 50) {
            currentGameState = GAME_STATE.MENU;
        }
    }
});

// Agregar botón de retorno en la pantalla de créditos
function drawCredits() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRÉDITOS', canvas.width / 2, canvas.height / 4);
    
    ctx.font = '24px Arial';
    ctx.fillText('Desarrollado por: [Willy Barrios]', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('Diseño de Juego: [Willy Barrios]', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Programación: [Willy Barrios]', canvas.width / 2, canvas.height / 2 + 40);
    
    ctx.font = '18px Arial';
    ctx.fillText('Presiona ESC para volver al menú', canvas.width / 2, canvas.height - 50);
    // Botón de retorno
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.8, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('VOLVER AL MENÚ', canvas.width / 2, canvas.height * 0.8 + 35);
}

// Modificar el event listener del teclado
document.addEventListener('keydown', (e) => {
    if (currentGameState === GAME_STATE.MENU) {
        if (e.key === ' ') {
            currentGameState = GAME_STATE.PLAYING;
            // Reiniciar variables del juego
            enemies = [];
            playerProjectiles = [];
            enemyProjectiles = [];
            enemySpawnTimer = 0;
            gameTime = 0;
            player.x = canvas.width / 2 - player.width / 2;
        } else if (e.key.toLowerCase() === 'c') {
            currentGameState = GAME_STATE.CREDITS;
        }
    } else if (currentGameState === GAME_STATE.CREDITS) {
        if (e.key === 'Escape') {
            currentGameState = GAME_STATE.MENU;
        }
    } else if (currentGameState === GAME_STATE.PLAYING) {
        keys[e.key] = true;
        if (e.key === ' ' && !spaceHold) {
            shoot();
            spaceHold = true;
        }
    }
});


// Mantener solo esta versión completa del gameLoop
function gameLoop() {
    if (currentGameState === GAME_STATE.MENU) {
        drawMainMenu();
    } else if (currentGameState === GAME_STATE.CREDITS) {
        drawCredits();
    } else {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

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

// --- Disparos de Enemigos ---
const enemyProjectiles = [];
const enemyProjectileSpeed = 5;
const enemyProjectileWidth = 4;
const enemyProjectileHeight = 10;
const enemyProjectileColor = 'red';
let enemyShootTimer = 0;
let baseEnemyShootInterval = 120; // Intervalo base de disparo
let minEnemyShootInterval = 30; // Intervalo mínimo de disparo
let gameTime = 0; // Contador de tiempo de juego

function enemyShoot(enemy) {
    const newProjectile = {
        x: enemy.x + enemy.width / 2 - enemyProjectileWidth / 2,
        y: enemy.y + enemy.height,
        width: enemyProjectileWidth,
        height: enemyProjectileHeight,
        color: enemyProjectileColor,
        speedY: enemyProjectileSpeed
    };
    enemyProjectiles.push(newProjectile);
}

function updateEnemyProjectiles() {
    for (let i = 0; i < enemyProjectiles.length; i++) {
        enemyProjectiles[i].y += enemyProjectiles[i].speedY;
        if (enemyProjectiles[i].y > canvas.height) {
            enemyProjectiles.splice(i, 1);
            i--;
        }
    }
}

// Modificar la función handleCollisions para incluir colisiones con disparos enemigos
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

    // Comprobar colisiones de disparos enemigos con el jugador
    for (let i = 0; i < enemyProjectiles.length; i++) {
        const projectile = enemyProjectiles[i];
        if (checkCollision(projectile, player)) {
            console.log("¡El jugador ha sido alcanzado!");
            enemyProjectiles.splice(i, 1);
            i--;
            // Aquí puedes agregar lógica de daño al jugador
        }
    }
}

// Modificar la función draw para dibujar los disparos enemigos
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar al jugador
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Dibujar los disparos
    ctx.fillStyle = projectileColor;
    for (const projectile of playerProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }

    // Dibujar los disparos enemigos
    ctx.fillStyle = enemyProjectileColor;
    for (const projectile of enemyProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }

    // Dibujar los enemigos
    drawEnemies();
}
document.getElementById('leftBtn').addEventListener('mousedown', () => {
    keys['ArrowLeft'] = true;
});
document.getElementById('leftBtn').addEventListener('mouseup', () => {
    keys['ArrowLeft'] = false;
});

document.getElementById('rightBtn').addEventListener('mousedown', () => {
    keys['ArrowRight'] = true;
});
document.getElementById('rightBtn').addEventListener('mouseup', () => {
    keys['ArrowRight'] = false;
});

document.getElementById('shootBtn').addEventListener('click', () => {
    shoot();
});
canvas.addEventListener('touchmove', (event) => {
    const touchX = event.touches[0].clientX;
    player.x = touchX - player.width / 2;
});


// --- Inicialización ---
gameLoop();

// Modificar la función update para incluir la lógica de disparo enemigo
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

    // Incrementar el tiempo de juego
    gameTime++;

    // Calcular el intervalo de disparo actual basado en el tiempo de juego
    const currentShootInterval = Math.max(
        minEnemyShootInterval,
        baseEnemyShootInterval - Math.floor(gameTime / 600) * 10
    );

    // Lógica de disparo enemigo
    enemyShootTimer++;
    if (enemyShootTimer >= currentShootInterval) {
        // Seleccionar un enemigo aleatorio para disparar
        const aliveEnemies = enemies.filter(enemy => enemy.alive);
        if (aliveEnemies.length > 0) {
            const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            enemyShoot(randomEnemy);
        }
        enemyShootTimer = 0;
    }

    // Actualizar proyectiles enemigos
    updateEnemyProjectiles();
}