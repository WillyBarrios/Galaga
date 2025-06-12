// ui.js

export const GAME_STATE = {
    MENU: 'menu',
    CREDITS: 'credits',
    PLAYING: 'playing',
    GAME_OVER: 'game-over'
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
}

export function drawGameOver(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Perdiste el Juego', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Presiona ESPACIO para reiniciar', canvas.width / 2, canvas.height / 2 + 30);
}


export function drawCredits(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRÉDITOS', canvas.width / 2, canvas.height / 4);

    ctx.font = '24px Arial';
    ctx.fillText('Desarrollado por: [Willy Barrios, Dorian Ortega y Jocias]', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('Diseño de Juego: [Willy Barrios, Dorian Ortega y Jocias]', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Programación: [Willy Barrios, Dorian Ortega, y Jocias]', canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '18px Arial';
    ctx.fillText('Presiona ESC para volver al menú', canvas.width / 2, canvas.height - 50);
}

export function startGame(state) {
    state.currentGameState = GAME_STATE.PLAYING;
    state.playerLives = 3;
    state.score = 0;
    state.enemySpawnTimer = 0;
    state.enemyShootTimer = 0;
    state.gameTime = 0;
    state.player.x = state.canvas.width / 2 - state.player.width / 2;
    state.playerProjectiles.length = 0;
    state.enemyProjectiles.length = 0;
    state.enemies.length = 0;
}
