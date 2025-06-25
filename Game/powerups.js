//powerups.js

// Importa funciones y sonidos necesarios desde el archivo principal
import {
    activarMusicaEspecial,
    activarMusicaTemporal,
    sonidoCohete,
    sonidoLuna,
    sonidoPunto
} from '../main.js';

// === IMÁGENES DE POWERUPS ===
// Crea un objeto con las imágenes de cada tipo de power-up
const powerUpImages = {
    invulnerability: new Image(),
    'triple-shot': new Image(),
    'super-move': new Image(),
    score: new Image()
};

// Asigna la ruta de la imagen correspondiente a cada tipo de power-up
powerUpImages.invulnerability.src = 'assets/powerups/estrella.png';
powerUpImages['triple-shot'].src = 'assets/powerups/luna.png';
powerUpImages['super-move'].src = 'assets/powerups/cohete.png';
powerUpImages.score.src = 'assets/powerups/punto.png';

// === TIPOS DE POWERUPS ===
// Define los tipos de power-ups disponibles en el juego
export const POWERUP_TYPES = {
    INVULNERABILITY: 'invulnerability',
    TRIPLE_SHOT: 'triple-shot',
    SUPER_MOVE: 'super-move',
    SCORE: 'score'
};

// Arreglo global donde se almacenan los power-ups activos en pantalla
export const powerUps = [];

// === GENERAR POWERUP ===
// Función para crear y agregar un nuevo power-up en la posición (x, y) y de un tipo específico
export function spawnPowerUp(x, y, type) {
    powerUps.push({
        x,
        y,
        width: 32,
        height: 32,
        type,
        active: true,
        speedY: 2 // Velocidad de caída vertical
    });
}

// === ACTUALIZACIÓN DE POWERUPS ===
// Actualiza la posición y estado de los power-ups, y gestiona su recogida y temporizadores
export function updatePowerUps(state) {
    for (const powerUp of powerUps) {
        powerUp.y += powerUp.speedY; // Mueve el power-up hacia abajo
        if (powerUp.y > state.canvas.height) powerUp.active = false; // Desactiva si sale de pantalla

        // Si el power-up está activo y colisiona con el jugador, aplica su efecto
        if (powerUp.active && checkCollision(powerUp, state.player)) {
            console.log("✅ Power-up recogido:", powerUp.type);
            applyPowerUpEffect(state, powerUp);
            powerUp.active = false;
        }
    }

    // Elimina los power-ups desactivados del arreglo
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (!powerUps[i].active) powerUps.splice(i, 1);
    }

    // Disminuye los temporizadores de los efectos activos y desactiva el efecto cuando termina
    if (state.powerUpTimers.invulnerability > 0) {
        state.powerUpTimers.invulnerability--;
        if (state.powerUpTimers.invulnerability === 0) {
            state.isInvulnerable = false;
        }
    }

    if (state.powerUpTimers.tripleShot > 0) {
        state.powerUpTimers.tripleShot--;
        if (state.powerUpTimers.tripleShot === 0) {
            state.tripleShot = false;
        }
    }

    if (state.powerUpTimers.superMove > 0) {
        state.powerUpTimers.superMove--;
        if (state.powerUpTimers.superMove === 0) {
            state.superMove = false;

            // Al terminar el super-move, activa invulnerabilidad temporal y movimiento hacia abajo
            state.isInvulnerable = true;
            state.powerUpTimers.invulnerability = 120; // 2 segundos aprox

            state.returningToBottom = true;
        }
    }
}

// === DIBUJAR POWERUPS ===
// Dibuja todos los power-ups activos en el canvas
export function drawPowerUps(ctx) {
    for (const p of powerUps) {
        const img = powerUpImages[p.type];
        if (img.complete) {
            ctx.drawImage(img, p.x, p.y, p.width, p.height);
        } else {
            // Si la imagen no está cargada, dibuja un cuadro gris
            ctx.fillStyle = 'gray';
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }
}

// === EFECTOS DE LOS POWERUPS ===
// Aplica el efecto correspondiente al tipo de power-up recogido
function applyPowerUpEffect(state, powerUp) {
    animatePlayerScale(state.player); // Efecto visual al recoger

    switch (powerUp.type) {
        case POWERUP_TYPES.INVULNERABILITY:
            state.isInvulnerable = true;
            state.powerUpTimers.invulnerability = 1800; // 30 segundos
            activarMusicaEspecial(30); // Cambia la música por la especial
            break;

        case POWERUP_TYPES.TRIPLE_SHOT:
            state.tripleShot = true;
            state.powerUpTimers.tripleShot = 1800; // 30 segundos
            activarMusicaTemporal(sonidoLuna, 30); // Música de la luna
            break;

        case POWERUP_TYPES.SUPER_MOVE:
            state.superMove = true;
            state.isInvulnerable = true;
            state.powerUpTimers.superMove = 1800; // 30 segundos
            activarMusicaTemporal(sonidoCohete, 30); // Música del cohete
            break;

        case POWERUP_TYPES.SCORE:
            state.score += 250; // Suma puntos
            sonidoPunto.pause();
            sonidoPunto.currentTime = 0;
            sonidoPunto.play(); // Sonido de puntos
            break;
    }
}

// === COLISIONES ===
// Verifica si dos objetos (a y b) colisionan (rectángulos)
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// === GENERAR ALEATORIOS POR NIVEL ===
// Decide si debe aparecer un power-up especial al subir de nivel
export function maybeSpawnPowerUpForLevel(state) {
    let type = null;

    // Power-ups fijos en ciertos niveles
    if (state.level === 5) type = POWERUP_TYPES.INVULNERABILITY;
    else if (state.level === 10) type = POWERUP_TYPES.TRIPLE_SHOT;
    else if (state.level === 15) type = POWERUP_TYPES.SUPER_MOVE;
    // Desde el nivel 16, hay probabilidad de que salga uno aleatorio
    else if (state.level >= 16 && Math.random() < 0.1) {
        const types = [
            POWERUP_TYPES.SCORE,
            POWERUP_TYPES.TRIPLE_SHOT,
            POWERUP_TYPES.SUPER_MOVE,
            POWERUP_TYPES.INVULNERABILITY
        ];
        type = types[Math.floor(Math.random() * types.length)];
    }

    // Si hay un tipo definido, lo genera en una posición aleatoria arriba
    if (type) {
        const x = Math.random() * (state.canvas.width - 24);
        const y = 0;
        spawnPowerUp(x, y, type);
    }
}

// === ANIMACIÓN AL RECOGER ===
// Efecto visual: agranda y reduce la nave del jugador rápidamente al recoger un power-up
function animatePlayerScale(player) {
    const originalWidth = player.width;
    const originalHeight = player.height;

    let growing = true;
    let steps = 0;
    const maxSteps = 10;
    const scaleFactor = 1.5;

    const interval = setInterval(() => {
        if (growing) {
            // Agranda la nave
            player.width = originalWidth * scaleFactor;
            player.height = originalHeight * scaleFactor;
            player.x -= (player.width - originalWidth) / 2;
            player.y -= (player.height - originalHeight) / 2;
        } else {
            // Devuelve la nave a su tamaño original
            player.width = originalWidth;
            player.height = originalHeight;
            player.x += (originalWidth * scaleFactor - originalWidth) / 2;
            player.y += (originalHeight * scaleFactor - originalHeight) / 2;
        }

        steps++;
        if (steps >= maxSteps) {
            clearInterval(interval); // Detiene la animación tras varios ciclos
        }

        growing = !growing; // Alterna entre agrandar y reducir
    }, 50);
}