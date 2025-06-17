// main.js
import {
    increaseLevel
} from './Game/level.js';
import {
    updatePowerUps, drawPowerUps
} from './Game/powerups.js';

import {
    GAME_STATE,
    drawMainMenu,
    drawCredits,
    drawGameOver,
    startGame,
    checkLevelProgress
} from './Game/ui.js';

import {
    handleCollisions
} from './Game/collisions.js';

import {
    spawnEnemyGroup,
    updateEnemies,
    drawEnemies,
    enemyImage
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

// === SONIDOS ===
const sonidoDisparo = new Audio('audio/sonido de laser.mp3');
const sonidoExplosion = new Audio('audio/sonido de explosion.mp3');
const sonidoFondo = new Audio('audio/musica de fondo.mp3');
const sonidoGameOver = new Audio('audio/sonido de partida terminada.mp3');
sonidoFondo.loop = true;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (state.currentGameState === GAME_STATE.MENU && e.key === ' ') {
        sonidoFondo.play(); // Música de fondo al iniciar
        startGame(state);
    } else if (state.currentGameState === GAME_STATE.CREDITS && e.key === 'Escape') {
        state.currentGameState = GAME_STATE.MENU;
    } else if (state.currentGameState === GAME_STATE.GAME_OVER && e.key === ' ') {
        sonidoFondo.play(); // Reproducir música si reinicia el juego
        startGame(state);
    } else if (state.currentGameState === GAME_STATE.PLAYING && e.key === ' ') {
        if (state.tripleShot) {
            shootTriple(state);
        } else {
            shoot(state);
        }
        sonidoDisparo.currentTime = 0;
        sonidoDisparo.play(); // Sonido de disparo
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

export const state = {
    currentGameState: GAME_STATE.MENU,
    playerLives: 3,
    score: 0,
    level: 1,
    gameTime: 0,
    enemySpawnTimer: 0,
    enemyShootTimer: 0,
    baseEnemyShootInterval: 60,
    enemySpawnInterval: 120,
    canvas: canvas,
    ctx: ctx,
    player: player,
    playerProjectiles: playerProjectiles,
    enemyProjectiles: enemyProjectiles,
    enemies: [],
    isPaused: false,
    pauseTimer: 0,
    enemyImage: enemyImage,
    isInvulnerable: false,
    tripleShot: false,
    superMove: false,
    powerUpTimers: {
        invulnerability: 0,
        tripleShot: 0,
        superMove: 0
    }
};

function update() {
    movePlayer(keys, {
        player: state.player,
        canvas: state.canvas,
        superMove: state.superMove
    });

    updatePowerUps(state);

    if (state.isPaused) {
        state.pauseTimer--;
        if (state.pauseTimer <= 0) {
            state.isPaused = false;
        }
        return;
    }

    updatePlayerProjectiles(state);
    updateEnemies(canvas.width, canvas.height, state);
    updateEnemyProjectiles(state);

    handleCollisions(state, {
        onPlayerHit: () => {
            state.playerLives--;
            sonidoExplosion.currentTime = 0;
            sonidoExplosion.play(); // Sonido al dañar jugador

            console.log("💥 Jugador alcanzado. Vidas restantes:", state.playerLives);

            if (state.playerLives <= 0) {
                state.currentGameState = GAME_STATE.GAME_OVER;

                sonidoFondo.pause();
                sonidoFondo.currentTime = 0;

                sonidoGameOver.currentTime = 0;
                sonidoGameOver.play(); // Sonido final

                const savedData = JSON.parse(localStorage.getItem('galagaHighScore')) || { score: 0 };
                if (state.score > savedData.score) {
                    localStorage.setItem('galagaHighScore', JSON.stringify({
                        username: state.username,
                        score: state.score
                    }));
                    console.log(`🎉 Nuevo puntaje máximo: ${state.score} por ${state.username}`);
                }
            } else {
                state.isPaused = true;
                state.pauseTimer = 60;
            }
        },
        onEnemyDestroyed: () => {
            state.score += 100;
            sonidoExplosion.currentTime = 0;
            sonidoExplosion.play(); // Sonido al destruir enemigo
        }
    });

    state.enemySpawnTimer++;
    if (state.enemySpawnTimer >= state.enemySpawnInterval) {
        spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
        state.enemySpawnTimer = 0;
    }

    state.enemyShootTimer++;
    if (state.enemyShootTimer >= state.baseEnemyShootInterval) {
        const aliveEnemies = state.enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0) {
            const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            enemyShoot(randomEnemy, state);
        }
        state.enemyShootTimer = 0;
    }

    state.gameTime++;
    checkLevelProgress(state);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(state.ctx, state.player);
    drawPlayerProjectiles(state);
    drawEnemyProjectiles(state.ctx, state);
    drawEnemies(state.ctx, state);
    drawPowerUps(state.ctx, state);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Puntos: ${state.score}`, 60, 20);
    ctx.fillText(`Vidas: ${state.playerLives}`, 60, 40);
    ctx.fillText(`Nivel: ${state.level}`, 60, 60);

    let yOffset = 80;
    ctx.font = '16px Arial';
    const savedData = JSON.parse(localStorage.getItem('galagaHighScore')) || { username: '-', score: 0 };
    ctx.fillText(`Puntaje máx: ${savedData.score} (${savedData.username})`, 60, yOffset);

    if (state.powerUpTimers.invulnerability > 0) {
        yOffset += 20;
        ctx.fillText(`Invulnerabilidad: ${state.powerUpTimers.invulnerability}s`, 80, yOffset);
    }
    if (state.powerUpTimers.tripleShot > 0) {
        yOffset += 20;
        ctx.fillText(`Disparo triple: ${state.powerUpTimers.tripleShot}s`, 80, yOffset);
    }
    if (state.powerUpTimers.superMove > 0) {
        yOffset += 20;
        ctx.fillText(`Súper movimiento: ${state.powerUpTimers.superMove}s`, 80, yOffset);
    }
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

// Soporte para táctil
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    if (state.currentGameState === GAME_STATE.MENU) {
        if (
            touchX >= canvas.width / 4 &&
            touchX <= canvas.width * 3 / 4 &&
            touchY >= canvas.height * 0.6 &&
            touchY <= canvas.height * 0.6 + 50
        ) {
            sonidoFondo.play(); // Música táctil
            startGame(state);
        }
    }
});

gameLoop();
