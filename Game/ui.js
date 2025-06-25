<<<<<<< HEAD
// Importamos funciones y variables necesarias del archivo powerups.js
=======
//ui.js
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
import { maybeSpawnPowerUpForLevel, powerUps } from './powerups.js';

// Definimos los distintos estados que puede tener el juego
export const GAME_STATE = {
    MENU: 'menu',           // Menú principal
    CREDITS: 'credits',     // Pantalla de créditos
    COMMANDS: 'commands',   // Pantalla de comandos
    PLAYING: 'playing',     // Juego en curso
    GAME_OVER: 'game_over'  // Juego terminado
};

// Dibuja el menú principal en pantalla
export function drawMainMenu(ctx, canvas) {
<<<<<<< HEAD

    ctx.fillStyle = 'black'; // Fondo negro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white'; // Texto blanco

=======
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
<<<<<<< HEAD

=======
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
    ctx.textAlign = 'center';
    ctx.fillText('GALAGA', canvas.width / 2, canvas.height * 0.2); // 👈 Título más arriba

    ctx.font = '20px Arial';
    ctx.fillText('Presiona ESPACIO para comenzar', canvas.width / 2, canvas.height * 0.3); // 👈 Ajustado
    ctx.fillText('Presiona C para ver los créditos', canvas.width / 2, canvas.height * 0.35); // 👈 Ajustado

    // Botón "INICIAR JUEGO"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
<<<<<<< HEAD

=======
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
    ctx.fillRect(canvas.width / 4, canvas.height * 0.45, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('INICIAR JUEGO', canvas.width / 2, canvas.height * 0.45 + 35);

    // Botón "VER COMANDOS"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.55, canvas.width / 2, 50);
<<<<<<< HEAD

=======
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
    ctx.fillStyle = 'white';
    ctx.fillText('VER COMANDOS', canvas.width / 2, canvas.height * 0.55 + 35);

    // Botón "VER CRÉDITOS"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.65, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('VER CRÉDITOS', canvas.width / 2, canvas.height * 0.65 + 35);
}

<<<<<<< HEAD

// Dibuja la pantalla de créditos del juego



=======
>>>>>>> 959a68ee78bda7ba40a6f2abec026be3a7d3659e
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
    ctx.fillText('Programación: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '18px Arial';
    ctx.fillText('Presiona ESC para volver al menú', canvas.width / 2, canvas.height - 50);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.8, canvas.width / 2, 50);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('VOLVER AL MENÚ', canvas.width / 2, canvas.height * 0.8 + 35);

}

// Dibuja la pantalla de comandos con instrucciones del juego
export function drawCommands(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.font = '36px Arial';
    ctx.fillText('🕹️ COMANDOS DEL JUEGO', canvas.width / 2, 100);

    // Lista de comandos del juego
    ctx.font = '20px Arial';
    const comandos = [
        '[←] / [→] - Mover nave',
        '[ESPACIO] - Disparar / Empezar juego',
        '[P] - Pausar / Reanudar',
        '[I] - Activar modo inmortal',
        '[ESC] - Confirmar salida',
        '[C] - Ver créditos',
        '[K] - Volver al menú'
    ];

    // Dibuja cada comando con un espacio vertical
    let y = 160;
    comandos.forEach(comando => {
        ctx.fillText(comando, canvas.width / 2, y);
        y += 30;
    });

    // Botón para volver al menú
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.8, canvas.width / 2, 50);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('VOLVER AL MENÚ', canvas.width / 2, canvas.height * 0.8 + 35);
}

// Dibuja la pantalla de "Game Over"
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

    // Muestra el puntaje más alto guardado en el localStorage
    const savedData = JSON.parse(localStorage.getItem('galagaHighScore')) || { username: '-', score: 0 };
    ctx.fillText(`Puntaje máximo: ${savedData.score} (${savedData.username})`, canvas.width / 2, canvas.height / 2 + 60);
}

// Inicializa el juego y sus variables
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

    // Posiciona al jugador en el centro inferior
    state.player.x = state.canvas.width / 2 - state.player.width / 2;
    state.player.y = state.canvas.height - state.player.height - 20;

    // Limpia proyectiles y enemigos previos
    state.playerProjectiles.length = 0;
    state.enemyProjectiles.length = 0;
    state.enemies.length = 0;

    // Reinicia habilidades
    state.isInvulnerable = false;
    state.tripleShot = false;
    state.superMove = false;

    // Carga los enemigos iniciales
    import('./enemy.js').then(({ spawnEnemyGroup }) => {
        spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
    });

    // Pide nombre de usuario si no se ha ingresado
    if (!state.username) {
        state.username = prompt("Por favor, ingresa tu nombre de usuario:");
        if (!state.username) {
            state.username = "Jugador"; // Valor por defecto
        }
    }
}

// Verifica si el jugador debe subir de nivel
export function checkLevelProgress(state) {
    const scoreThreshold = state.level * 1000; // Puntaje requerido para subir de nivel
    if (state.score >= scoreThreshold) {
        state.level++;
        console.log(`🔼 Nivel subido a ${state.level}`);

        // Aumenta la velocidad de los enemigos existentes
        state.enemies.forEach(enemy => {
            enemy.speedX *= 1.2;
            enemy.speedY *= 1.2;
        });

        // Ajusta dificultad: más disparos y más enemigos
        state.baseEnemyShootInterval = Math.max(10, 60 - state.level * 5);
        state.enemySpawnInterval = Math.max(30, 120 - state.level * 10);

        // Puede aparecer un nuevo power-up
        maybeSpawnPowerUpForLevel(state);
    }
}
