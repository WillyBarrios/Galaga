const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'assets/player.png';

const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height - 50,
    width: 32,
    height: 32,
    speed: 5
};

const keys = {};
let spaceHold = false; // Para controlar la pulsación continua de la barra espaciadora

const playerProjectiles = [];
const projectileSpeed = -10;
const projectileWidth = 4;
const projectileHeight = 10;
const projectileColor = 'lime';

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

function update() {
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
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Dibujar los disparos
    ctx.fillStyle = projectileColor;
    for (const projectile of playerProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();