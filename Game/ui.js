// Importamos funciones y variables necesarias del archivo powerups.js
import { maybeSpawnPowerUpForLevel, powerUps } from './powerups.js';

// Definición de los distintos estados posibles del juego
export const GAME_STATE = {
    MENU: 'menu',           // Menú principal
    CREDITS: 'credits',     // Pantalla de créditos
    COMMANDS: 'commands',   // Pantalla de comandos/instrucciones
    PLAYING: 'playing',     // Juego en curso
    GAME_OVER: 'game_over'  // Pantalla de fin de juego
};

// Dibuja el menú principal en el canvas
export function drawMainMenu(ctx, canvas) {

    ctx.fillStyle = 'black'; // Fondo negro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white'; // Texto blanco

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo negro

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';

    ctx.textAlign = 'center';
    ctx.fillText('GALAGA', canvas.width / 2, canvas.height * 0.2); // Título del juego

    ctx.font = '20px Arial';
    ctx.fillText('Presiona ESPACIO para comenzar', canvas.width / 2, canvas.height * 0.3); // Instrucción para empezar
    ctx.fillText('Presiona C para ver los créditos', canvas.width / 2, canvas.height * 0.35); // Instrucción para créditos

    // Dibuja botón "INICIAR JUEGO"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

    ctx.fillRect(canvas.width / 4, canvas.height * 0.45, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('INICIAR JUEGO', canvas.width / 2, canvas.height * 0.45 + 35);

    // Dibuja botón "VER COMANDOS"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.55, canvas.width / 2, 50);

    ctx.fillStyle = 'white';
    ctx.fillText('VER COMANDOS', canvas.width / 2, canvas.height * 0.55 + 35);

    // Dibuja botón "VER CRÉDITOS"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.65, canvas.width / 2, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('VER CRÉDITOS', canvas.width / 2, canvas.height * 0.65 + 35);
}


// Dibuja la pantalla de créditos del juego



export function drawCredits(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo negro

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRÉDITOS', canvas.width / 2, canvas.height / 4); // Título

    ctx.font = '24px Arial';
    ctx.fillText('Desarrollado por: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('Diseño de Juego: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Programación: [Willy Barrios, Dorian Ortega]', canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '18px Arial';
    ctx.fillText('Presiona ESC para volver al menú', canvas.width / 2, canvas.height - 50);

    // Dibuja botón para volver al menú
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.8, canvas.width / 2, 50);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('VOLVER AL MENÚ', canvas.width / 2, canvas.height * 0.8 + 35);
}

// Dibuja la pantalla de comandos/instrucciones
export function drawCommands(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo negro

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.font = '36px Arial';
    ctx.fillText('🕹️ COMANDOS DEL JUEGO', canvas.width / 2, 100); // Título

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

    // Dibuja cada comando con espacio vertical
    let y = 160;
    comandos.forEach(comando => {
        ctx.fillText(comando, canvas.width / 2, y);
        y += 30;
    });

    // Dibuja botón para volver al menú
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width / 4, canvas.height * 0.8, canvas.width / 2, 50);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('VOLVER AL MENÚ', canvas.width / 2, canvas.height * 0.8 + 35);
}

// Dibuja la pantalla de "Game Over"
export function drawGameOver(ctx, canvas) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo negro

    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡GAME OVER!', canvas.width / 2, canvas.height / 2 - 20); // Mensaje principal

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Presiona ESPACIO para reiniciar', canvas.width / 2, canvas.height / 2 + 30); // Instrucción

    // Muestra el puntaje más alto guardado en el localStorage
    const savedData = JSON.parse(localStorage.getItem('galagaHighScore')) || { username: '-', score: 0 };
    ctx.fillText(`Puntaje máximo: ${savedData.score} (${savedData.username})`, canvas.width / 2, canvas.height / 2 + 60);
}

// Inicializa el juego y sus variables principales
export function startGame(state) {
    state.currentGameState = GAME_STATE.PLAYING; // Cambia a estado de juego
    state.playerLives = 3;                       // Reinicia vidas
    state.score = 0;                             // Reinicia puntaje
    state.level = 1;                             // Reinicia nivel
    state.enemySpawnTimer = 0;                   // Reinicia temporizador de aparición de enemigos
    state.enemyShootTimer = 0;                   // Reinicia temporizador de disparo enemigo
    state.gameTime = 0;                          // Reinicia tiempo de juego
    state.isPaused = false;                      // Quita pausa
    state.pauseTimer = 0;                        // Reinicia temporizador de pausa
    state.baseEnemyShootInterval = 60;           // Intervalo base de disparo enemigo
    state.enemySpawnInterval = 120;              // Intervalo base de aparición de enemigos

    // Posiciona al jugador en el centro inferior del canvas
    state.player.x = state.canvas.width / 2 - state.player.width / 2;
    state.player.y = state.canvas.height - state.player.height - 20;

    // Limpia proyectiles y enemigos previos
    state.playerProjectiles.length = 0;
    state.enemyProjectiles.length = 0;
    state.enemies.length = 0;

    // Reinicia habilidades y power-ups
    state.isInvulnerable = false;
    state.tripleShot = false;
    state.superMove = false;

    // Carga los enemigos iniciales usando import dinámico
    import('./enemy.js').then(({ spawnEnemyGroup }) => {
        spawnEnemyGroup(state.canvas.width, state.canvas.height, state);
    });

    // Solicita nombre de usuario si no existe
    if (!state.username) {
        state.username = prompt("Por favor, ingresa tu nombre de usuario:");
        if (!state.username) {
            state.username = "Jugador"; // Valor por defecto si no ingresa nada
        }
    }
}

// Verifica si el jugador debe subir de nivel según el puntaje
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

        // Puede aparecer un nuevo power-up al subir de nivel
        maybeSpawnPowerUpForLevel(state);
    }
}