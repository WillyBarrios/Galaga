// main.js

import {
    GAME_STATE,
    drawMainMenu,
    drawCredits,
    drawGameOver,
    startGame
} from './Game/ui.js';

import {
    handleCollisions 
} from './Game/collisions.js';

import {
    enemies,
    spawnEnemyGroup,
    updateEnemies,
    drawEnemies
} from './Game/enemy.js';

import {
    player,
    initPlayer,
    movePlayer,
    drawPlayer
} from './Game/player.js';

import {
    playerProjectiles,
    enemyProjectiles,
    shoot,
    enemyShoot,
    updatePlayerProjectiles,
    updateEnemyProjectiles,
    drawPlayerProjectiles,
    drawEnemyProjectiles
} from './Game/projectile.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const playerImage = new Image();
playerImage.src = 'assets/Diseño sin título/1.png';
const enemyImage = new Image();
enemyImage.src = 'assets/Diseño sin título/nivel 1.png';

initPlayer(canvas);

const state = {
    currentGameState: GAME_STATE.MENU,
    playerLives: 3,
    score: 0,
    gameTime: 0,
    enemySpawnTimer: 0,
    enemyShootTimer: 0,
    canvas: canvas,
    ctx: ctx,
    player: player,
    playerProjectiles: playerProjectiles,
    enemyProjectiles: enemyProjectiles,
    enemies: enemies,
    isPaused: false,
    pauseTimer: 0
};

const keys = {};
let spaceHold = false;

document.addEventListener('keydown', (e) => {
    if (state.currentGameState === GAME_STATE.MENU) {
        if (e.key === ' ') {
            startGame(state);
        } else if (e.key.toLowerCase() === 'c') {
            state.currentGameState = GAME_STATE.CREDITS;
        }
    } else if (state.currentGameState === GAME_STATE.CREDITS) {
        if (e.key === 'Escape') {
            state.currentGameState = GAME_STATE.MENU;
        }
    } else if (state.currentGameState === GAME_STATE.GAME_OVER) {
        if (e.key === ' ') {
            startGame(state);
        }
    } else if (state.currentGameState === GAME_STATE.PLAYING) {
        keys[e.key] = true;
        if (e.key === ' ' && !spaceHold) {
            shoot(state.player);
            spaceHold = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') {
        spaceHold = false;
    }
});

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
    shoot(state.player);
});

canvas.addEventListener('touchmove', (event) => {
    const touchX = event.touches[0].clientX;
    state.player.x = touchX - state.player.width / 2;
});

function update() {
    if (state.isPaused) {
        state.pauseTimer--;
        if (state.pauseTimer <= 0) {
            state.isPaused = false;
        }
        return;
    }

    movePlayer(keys, canvas);
    updatePlayerProjectiles(canvas);
    updateEnemies(canvas.width, canvas.height);

    state.enemySpawnTimer++;
    if (state.enemySpawnTimer >= 120) {
        spawnEnemyGroup(canvas.width, canvas.height);
        state.enemySpawnTimer = 0;
    }

    handleCollisions({
        onPlayerHit: () => {
            console.log("\u00a1El jugador ha sido alcanzado!");
            state.playerLives--;
            state.isPaused = true;
            state.pauseTimer = 60; // 1 segundo
            if (state.playerLives <= 0) {
                state.currentGameState = GAME_STATE.GAME_OVER;
            }
        },
        onEnemyDestroyed: () => {
            state.score += 100;
        }
    });

    state.gameTime++;

    const currentShootInterval = Math.max(
        30,
        120 - Math.floor(state.gameTime / 600) * 10
    );

    state.enemyShootTimer++;
    if (state.enemyShootTimer >= currentShootInterval) {
        const aliveEnemies = state.enemies.filter(enemy => enemy.alive);
        if (aliveEnemies.length > 0) {
            const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            enemyShoot(randomEnemy);
        }
        state.enemyShootTimer = 0;
    }

    updateEnemyProjectiles(canvas);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx, playerImage);
    drawPlayerProjectiles(ctx);
    drawEnemyProjectiles(ctx);
    drawEnemies(ctx, enemyImage);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Vidas: ${state.playerLives}`, 35 , 20);
    ctx.fillText(`Puntos: ${state.score}`, 35, 40);
}

function gameLoop() {
    if (state.currentGameState === GAME_STATE.MENU) {
        drawMainMenu(ctx, canvas);
    } else if (state.currentGameState === GAME_STATE.CREDITS) {
        drawCredits(ctx, canvas);
    } else if (state.currentGameState === GAME_STATE.GAME_OVER) {
        drawGameOver(ctx, canvas);
    } else {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
