// === main.js actualizado: hello ===

import {
    increaseLevel
} from './Game/level.js';

import {
    updatePowerUps,
    drawPowerUps
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
const sonidoEspecial = new Audio('audio/sonido de estrella.mp3');

const sonidoCohete = new Audio('audio/sonido_cohete.mp3');
const sonidoLuna = new Audio('audio/sonido_luna.mp3');
const sonidoPunto = new Audio('audio/sonido_punto.mp3');

sonidoFondo.loop = true;
sonidoEspecial.loop = false;

let musicaTemporalActiva = null;

function activarMusicaTemporal(audio, duracionEnSegundos = 30) {
    if (musicaTemporalActiva) {
        musicaTemporalActiva.pause();
        musicaTemporalActiva.currentTime = 0;
    }

    sonidoFondo.pause();
    sonidoFondo.currentTime = 0;

    musicaTemporalActiva = audio;
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
        if (musicaTemporalActiva === audio) {
            audio.pause();
            audio.currentTime = 0;
            musicaTemporalActiva = null;
            sonidoFondo.play();
        }
    }, duracionEnSegundos * 1000);
}

export function activarMusicaEspecial(duracion = 30) {
    activarMusicaTemporal(sonidoEspecial, duracion);
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

const keys = {};

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
    enemyImage: enemyImage,
    isInvulnerable: false,
    tripleShot: false,
    superMove: false,
    isImmortal: false,
    lifeLostActive: false,
    lifeLostTimer: 0,
    lifeLostTimerMax: 0,
    powerUpTimers: {
        invulnerability: 0,
        tripleShot: 0,
        superMove: 0
    }
};

function shootTriple(state) {
    const { x, y, width } = state.player;
    const centerX = x + width / 2;

    state.playerProjectiles.push(
        { x: centerX - 12, y, width: 4, height: 10, speedY: -5 },
        { x: centerX, y, width: 4, height: 10, speedY: -5 },
        { x: centerX + 12, y, width: 4, height: 10, speedY: -5 }
    );
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key.toLowerCase() === 'p' && state.currentGameState === GAME_STATE.PLAYING) {
        state.isPaused = !state.isPaused;
        console.log(state.isPaused ? '⏸️ Juego en pausa' : '▶️ Juego reanudado');
        if (state.isPaused) {
            sonidoFondo.pause();
            if (musicaTemporalActiva) musicaTemporalActiva.pause();
        } else {
            if (!musicaTemporalActiva) sonidoFondo.play();
            else musicaTemporalActiva.play();
        }
    }

    if (e.key === 'i') {
        state.isImmortal = !state.isImmortal;
        console.log(`🛡️ Modo inmortal: ${state.isImmortal ? 'ACTIVADO' : 'DESACTIVADO'}`);
    }

    if (state.currentGameState === GAME_STATE.MENU && e.key === ' ') {
        sonidoFondo.play();
        startGame(state);
    } else if (state.currentGameState === GAME_STATE.MENU && e.key.toLowerCase() === 'c') {
        state.currentGameState = GAME_STATE.CREDITS;
    } else if (state.currentGameState === GAME_STATE.CREDITS && e.key === 'Escape') {
        state.currentGameState = GAME_STATE.MENU;
    } else if (state.currentGameState === GAME_STATE.GAME_OVER && e.key === ' ') {
        sonidoFondo.play();
        startGame(state);
    } else if (state.currentGameState === GAME_STATE.PLAYING && e.key === ' ' && !state.isPaused) {
        if (state.tripleShot) {
            shootTriple(state);
        } else {
            shoot(state);
        }
        sonidoDisparo.currentTime = 0;
        sonidoDisparo.play();
    }
    else if (state.currentGameState === GAME_STATE.PLAYING && e.key === 'Escape') {
        state.showExitConfirm = true;
        state.isPaused = true;
    }
    else if (state.showExitConfirm && e.key.toLowerCase() === 'y') {
        salirAlMenu();
    }
    else if (state.showExitConfirm && e.key.toLowerCase() === 'n') {
        state.showExitConfirm = false;
        state.isPaused = false;
    }


});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function update() {
    if (state.lifeLostActive) {
        state.lifeLostTimer--;
        if (state.lifeLostTimer <= 0) {
            state.lifeLostActive = false;
        }
        return; // Detener updates mientras mostramos el mensaje
    }

    if (state.isPaused) {
        return;
    }
    movePlayer(keys, {
        player: state.player,
        canvas: state.canvas,
        superMove: state.superMove
    });

    updatePowerUps(state);
    updatePlayerProjectiles(state);
    updateEnemies(canvas.width, canvas.height, state);
    updateEnemyProjectiles(state);

    handleCollisions(state, {
        onPlayerHit: () => {
            if (!state.isImmortal) {
                state.playerLives--;
                if (state.playerLives <= 0) {
                    state.currentGameState = GAME_STATE.GAME_OVER;
                    sonidoFondo.pause();
                    sonidoGameOver.currentTime = 0;
                    sonidoGameOver.play();

                    const saved = JSON.parse(localStorage.getItem('galagaHighScore')) || { score: 0 };
                    if (state.score > saved.score) {
                        localStorage.setItem('galagaHighScore', JSON.stringify({
                            username: state.username,
                            score: state.score
                        }));
                        console.log(`🎉 Nuevo puntaje máximo: ${state.score}`);
                    }
                } else {
                    state.lifeLostActive = true;
                    state.lifeLostTimer = 60;
                    state.lifeLostTimerMax = 60
                }
            }
            sonidoExplosion.currentTime = 0;
            sonidoExplosion.play();
        },
        onEnemyDestroyed: () => {
            state.score += 100;
            sonidoExplosion.currentTime = 0;
            sonidoExplosion.play();
        }
    });

    state.enemySpawnTimer++;
    if (state.enemySpawnTimer >= state.enemySpawnInterval) {
        spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
        state.enemySpawnTimer = 0;
    }

    state.enemyShootTimer++;
    if (state.enemyShootTimer >= state.baseEnemyShootInterval) {
        const vivos = state.enemies.filter(e => e.alive);
        if (vivos.length > 0) {
            const enemigo = vivos[Math.floor(Math.random() * vivos.length)];
            enemyShoot(enemigo, state);
        }
        state.enemyShootTimer = 0;
    }

    state.gameTime++;
    checkLevelProgress(state);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx, state.player);
    drawPlayerProjectiles(state);
    drawEnemyProjectiles(ctx, state);
    drawEnemies(ctx, state);
    drawPowerUps(ctx, state);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'start'; // Alineación izquierda

    const x = 20;
    let y = 20;

    ctx.fillText(`Puntos: ${state.score}`, x, y);
    y += 20;
   ctx.fillText("Vidas:", x, y);

let heartX = x + 60; // posición inicial para los corazones (separado del texto "Vidas:")
for (let i = 0; i < state.playerLives; i++) {
    ctx.fillText("❤️", heartX + i * 22, y); // dibuja un corazón por vida
}
;
    y += 20;
    ctx.fillText(`Nivel: ${state.level}`, x, y);
    y += 20;

    const high = JSON.parse(localStorage.getItem('galagaHighScore')) || { username: '-', score: 0 };
    ctx.fillText(`Puntaje máx: ${high.score} (${high.username})`, x, y);
    y += 20;

    if (state.powerUpTimers.invulnerability > 0) {
        ctx.fillText(`Invulnerabilidad: ${state.powerUpTimers.invulnerability}`, x + 20, y);
        y += 20;
    }
    if (state.powerUpTimers.tripleShot > 0) {
        ctx.fillText(`Disparo triple: ${state.powerUpTimers.tripleShot}`, x + 20, y);
        y += 20;
    }
    if (state.powerUpTimers.superMove > 0) {
        ctx.fillText(`Súper movimiento: ${state.powerUpTimers.superMove}`, x + 20, y);
        y += 20;
    }

    // === Cartel de inmortalidad (también a la izquierda)
    if (state.isImmortal) {
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 16px Arial';
        ctx.fillText("🛡️ MODO INMORTAL ACTIVADO", canvas.width - 270, 30);
    }

    if (state.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⏸️ JUEGO EN PAUSA', canvas.width / 2, canvas.height / 2);
        ctx.restore();
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

canvas.addEventListener('touchstart', (event) => {
    const t = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    if (state.currentGameState === GAME_STATE.MENU) {
        if (x >= canvas.width / 4 && x <= canvas.width * 3 / 4 && y >= canvas.height * 0.6 && y <= canvas.height * 0.6 + 50) {
            sonidoFondo.play();
            startGame(state);
        }
    }
});
function salirAlMenu() {
    sonidoFondo.pause();
    sonidoFondo.currentTime = 0;

    if (musicaTemporalActiva) {
        musicaTemporalActiva.pause();
        musicaTemporalActiva.currentTime = 0;
    }

    state.currentGameState = GAME_STATE.MENU;
    state.playerLives = 3;
    state.score = 0;
    state.level = 1;
    state.isPaused = false;
    state.tripleShot = false;
    state.superMove = false;
    state.isInvulnerable = false;
    state.enemyProjectiles.length = 0;
    state.playerProjectiles.length = 0;
    state.enemies.length = 0;
    state.showExitConfirm = false;
}
gameLoop();

export {
    sonidoCohete,
    sonidoLuna,
    sonidoPunto,
    activarMusicaTemporal
};