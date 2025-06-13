// ui.js
import { maybeSpawnPowerUpForLevel, powerUps } from './powerups.js';
export const GAME_STATE = {
    MENU: 'menu',
    CREDITS: 'credits',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

export function drawMainMenu(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GALAGA', canvas.width / 2, canvas.height / 3);

    ctx.font = '24px Arial';
    ctx.fillText('Presiona ESPACIO para comenzar', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Presiona C para ver los créditos', canvas.width / 2, canvas.height / 2 + 40);

    // Botón táctil - INICIAR JUEGO
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.6, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('INICIAR JUEGO', canvas.width / 2, canvas.height * 0.6 + 35);
}

export function drawCredits(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRÉDITOS', canvas.width / 2, canvas.height / 4);

    ctx.font = '24px Arial';
    ctx.fillText('Desarrollado por: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('Diseño de Juego: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Programación: [Willy Barrios, Dorian Ortega,]', canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '18px Arial';
    ctx.fillText('Presiona ESC para volver al menú', canvas.width / 2, canvas.height - 50);
}

export function drawGameOver(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡GAME OVER!', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Presiona ESPACIO para reiniciar', canvas.width / 2, canvas.height / 2 + 30);
}

export function startGame(state) {
    state.currentGameState = GAME_STATE.PLAYING;
    state.playerLives = 3;
    state.score = 0;
    state.level = 1;
    state.enemySpawnTimer = 0;
    state.enemyShootTimer = 0;
    state.gameTime = 0;
    state.isPaused = false;
    state.pauseTimer = 0;
    state.baseEnemyShootInterval = 60;
    state.enemySpawnInterval = 120;
    state.player.x = state.canvas.width / 2 - state.player.width / 2;
    state.player.y = state.canvas.height - state.player.height - 20;
    state.playerProjectiles.length = 0;
    state.enemyProjectiles.length = 0;
    state.enemies.length = 0;
    state.isInvulnerable = false;
    state.tripleShot = false;
    state.superMove = false;
    // Generar primer grupo de enemigos
    import('./enemy.js').then(({ spawnEnemyGroup }) => {
        spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
    });
}

export function checkLevelProgress(state) {
    const scoreThreshold = state.level * 1000;
    if (state.score >= scoreThreshold) {
        state.level++;
        console.log(`🔼 Nivel subido a ${state.level}`);

        // Aumentar dificultad
        state.enemies.forEach(enemy => {
            enemy.speedX *= 1.2;
            enemy.speedY *= 1.2;
        });

        state.baseEnemyShootInterval = Math.max(10, 60 - state.level * 5);
        state.enemySpawnInterval = Math.max(30, 120 - state.level * 10);

        maybeSpawnPowerUpForLevel(state);
    }


}
