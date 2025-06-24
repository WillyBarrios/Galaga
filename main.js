// === main.js actualizado: se actualizo===

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
    drawCommands,
    drawGameOver,
    startGame,
    checkLevelProgress
} from './Game/ui.js';

import {
    handleCollisions,
    checkCollision
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
import {
    spawnBoss,
    updateBoss,
    drawBoss,
    drawBossProjectiles
} from './Game/boss.js';

const sonidoBossIntro = new Audio('audio/boss.mp3');


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
    musicaTemporalActiva.currentTime = 0;
    musicaTemporalActiva.play();

    // Clear any existing timer
    if (activarMusicaTemporal.timer) {
        clearTimeout(activarMusicaTemporal.timer);
    }

    activarMusicaTemporal.timer = setTimeout(() => {
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
    returningToBottom: false,
    lifeLostTimer: 0,
    lifeLostTimerMax: 0,
    bossDefeatedActive: false,
    bossDefeatedTimer: 0,

    powerUpTimers: {
        invulnerability: 0,
        tripleShot: 0,
        superMove: 0
    },
    bossIntroActive: false,
    bossIntroTimer: 0,


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

    if (state.currentGameState === GAME_STATE.COMMANDS && e.key.toLowerCase() === 'k') {
        state.currentGameState = GAME_STATE.MENU;
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
    if ([5, 10, 15].includes(state.level) && (!state.boss || !state.boss.active) && !state.bossIntroActive) {
        spawnBoss(state);
        console.log("Boss creado:", state.boss);
        state.enemies = [];
        state.bossIntroActive = true;
        state.bossIntroTimer = 180; // 3 segundos si usas 60 FPS
        sonidoFondo.pause();
        sonidoBossIntro.play();
        state.playerProjectiles.length = 0;
        state.enemyProjectiles.length = 0;

    }

    if (state.bossIntroActive) {
        state.bossIntroTimer--;
        if (state.bossIntroTimer <= 0) {
            state.bossIntroActive = false;
            sonidoBossIntro.pause();
            sonidoBossIntro.currentTime = 0;
            sonidoFondo.play();
        }
        return;
    }
    if (state.boss && state.boss.active) {
        updateBoss(state);
    }
    console.log("Boss Intro Active:", state.bossIntroActive);
    console.log("Boss Active:", state.bossActive);

    if (state.bossDefeatedActive) {
        state.bossDefeatedTimer--;
        if (state.bossDefeatedTimer <= 0) {
            state.bossDefeatedActive = false;
            state.isPaused = false;
            sonidoFondo.play();
        }
        return; // Detener updates mientras mostramos el mensaje
    }

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
        },
        onBossDefeated: () => {
            state.bossDefeatedActive = true;
            state.bossDefeatedTimer = 180;
            state.isPaused = true;
            sonidoFondo.pause();
            sonidoFondo.currentTime = 0;
            console.log("✅ Boss derrotado, muestra mensaje");
            // Aquí podrías poner un sonido de victoria si quieres
        }
    });
    if (state.bossActive && !state.bossIntroActive) {
        updateBoss(state);

        if (state.bossProjectiles) {
            for (let i = state.bossProjectiles.length - 1; i >= 0; i--) {
                const p = state.bossProjectiles[i];
                p.y += p.speedY;

                if (p.y > state.canvas.height) {
                    state.bossProjectiles.splice(i, 1);
                    continue;
                }

                if (!state.isInvulnerable && checkCollision(p, state.player)) {
                    state.bossProjectiles.splice(i, 1);
                    i--;

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
                            state.lifeLostTimerMax = 60;
                        }
                    }

                    sonidoExplosion.currentTime = 0;
                    sonidoExplosion.play();

                    break;
                }
            }
        }
    }

    else {
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer >= state.enemySpawnInterval) {
            spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
            state.enemySpawnTimer = 0;
        }
    }

    if (!state.bossActive) {
        state.enemyShootTimer++;
        if (state.enemyShootTimer >= state.baseEnemyShootInterval) {

            const vivos = state.enemies.filter(e => e.alive);
            if (vivos.length > 0) {
                const enemigo = vivos[Math.floor(Math.random() * vivos.length)];
                enemyShoot(enemigo, state);
            }
            state.enemyShootTimer = 0;
        }
    }

    state.gameTime++;
    checkLevelProgress(state);
    if (state.returningToBottom) {
        state.player.y += 5; // velocidad de descenso
        if (state.player.y >= state.canvas.height - state.player.height - 20) {
            state.player.y = state.canvas.height - state.player.height - 20;
            state.returningToBottom = false;
            // La invulnerabilidad terminará por el propio temporizador que ya tienes
        }
    }
    if (state.level >= 15) {
        state.invertedControls = true;
    } else {
        state.invertedControls = false;
    }

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === Dibujar entidades del juego ===
    drawPlayer(ctx, state.player);
    drawPlayerProjectiles(state);
    drawEnemyProjectiles(ctx, state);
    drawEnemies(ctx, state);
    drawBoss(ctx, state);
    drawBossProjectiles(ctx, state);
    drawPowerUps(ctx, state);

    // === HUD: Fijo a la izquierda ===
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

    // === Cartel de vida perdida ===
    if (state.lifeLostActive) {
        ctx.save();
        const alpha = 1 - (state.lifeLostTimer / state.lifeLostTimerMax);
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Vida perdida!', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    if (state.bossDefeatedActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✅ ¡La nave nodriza ha sido destruida!', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    // === Cartel de confirmación de salida ===
    else if (state.showExitConfirm) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ Salir al menú principal', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '20px Arial';
        ctx.fillText('Se perderá el progreso actual.', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Presiona Y para confirmar o N para cancelar.', canvas.width / 2, canvas.height / 2 + 40);
        ctx.restore();
    }
    // === Cartel de pausa normal ===
    else if (state.isPaused) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⏸️ JUEGO EN PAUSA', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }


    if (state.bossIntroActive) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Se acerca una nave nodriza!', canvas.width / 2, canvas.height / 2);
    }

    if (state.bossProjectiles) {
        for (let i = 0; i < state.bossProjectiles.length; i++) {
            const p = state.bossProjectiles[i];
            p.y += p.speedY;
            if (p.y > state.canvas.height) {
                state.bossProjectiles.splice(i, 1);
                i--;
            }
        }
    }

}

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (state.currentGameState === GAME_STATE.MENU) {
        const btnJugar = {
            x: canvas.width / 4,
            y: canvas.height * 0.6,
            width: canvas.width / 2,
            height: 50
        };

        const btnComandos = {
            x: canvas.width / 4,
            y: canvas.height * 0.7,
            width: canvas.width / 2,
            height: 50
        };

        if (x >= btnJugar.x && x <= btnJugar.x + btnJugar.width && y >= btnJugar.y && y <= btnJugar.y + btnJugar.height) {
            sonidoFondo.play();
            startGame(state);
        }

        if (x >= btnComandos.x && x <= btnComandos.x + btnComandos.width && y >= btnComandos.y && y <= btnComandos.y + btnComandos.height) {
            state.currentGameState = GAME_STATE.COMMANDS;
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

function gameLoop() {
    if (state.currentGameState === GAME_STATE.MENU) {
        drawMainMenu(ctx, canvas);
    } else if (state.currentGameState === GAME_STATE.CREDITS) {
        drawCredits(ctx, canvas);
    } else if (state.currentGameState === GAME_STATE.COMMANDS) {
        drawCommands(ctx, canvas); // ✅ Pantalla de comandos
    } else if (state.currentGameState === GAME_STATE.GAME_OVER) {
        drawGameOver(ctx, canvas);
    } else {
        update();
        draw();
    }

    requestAnimationFrame(gameLoop);
}document.getElementById('leftBtn').addEventListener('mousedown', () => {
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
    shoot(state);
});
canvas.addEventListener('touchmove', (event) => {
    const touchX = event.touches[0].clientX;
    player.x = touchX - player.width / 2;
});
gameLoop();


export {
    sonidoCohete,
    sonidoLuna,
    sonidoPunto,
    activarMusicaTemporal
};

