import {
    activarMusicaEspecial,
    activarMusicaTemporal,
    sonidoCohete,
    sonidoLuna,
    sonidoPunto
} from '../main.js'; // Asegúrate de que la ruta sea correcta

// === IMÁGENES DE POWERUPS ===
const powerUpImages = {
    invulnerability: new Image(),
    'triple-shot': new Image(),
    'super-move': new Image(),
    score: new Image()
};

powerUpImages.invulnerability.src = 'assets/powerups/estrella.png';
powerUpImages['triple-shot'].src = 'assets/powerups/luna.png';
powerUpImages['super-move'].src = 'assets/powerups/cohete.png';
powerUpImages.score.src = 'assets/powerups/punto.png';

// === TIPOS DE POWERUPS ===
export const POWERUP_TYPES = {
    INVULNERABILITY: 'invulnerability',
    TRIPLE_SHOT: 'triple-shot',
    SUPER_MOVE: 'super-move',
    SCORE: 'score'
};

export const powerUps = [];

// === GENERAR POWERUP ===
export function spawnPowerUp(x, y, type) {
    powerUps.push({
        x,
        y,
        width: 32,
        height: 32,
        type,
        active: true,
        speedY: 2
    });
}

// === ACTUALIZACIÓN DE POWERUPS ===
export function updatePowerUps(state) {
    for (const powerUp of powerUps) {
        powerUp.y += powerUp.speedY;
        if (powerUp.y > state.canvas.height) powerUp.active = false;

        if (powerUp.active && checkCollision(powerUp, state.player)) {
            console.log("✅ Power-up recogido:", powerUp.type);
            applyPowerUpEffect(state, powerUp);
            powerUp.active = false;
        }
    }

    // Limpiar desactivados
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (!powerUps[i].active) powerUps.splice(i, 1);
    }

    // Decrementar temporizadores
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

        // Activar invulnerabilidad temporal al terminar superMove
        state.isInvulnerable = true;
        state.powerUpTimers.invulnerability = 120; // 2 segundos aprox (ajusta a gusto)

        // Iniciar movimiento hacia abajo
        state.returningToBottom = true;
    }
}

}

// === DIBUJAR POWERUPS ===
export function drawPowerUps(ctx) {
    for (const p of powerUps) {
        const img = powerUpImages[p.type];
        if (img.complete) {
            ctx.drawImage(img, p.x, p.y, p.width, p.height);
        } else {
            ctx.fillStyle = 'gray';
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }
}

// === EFECTOS DE LOS POWERUPS ===
function applyPowerUpEffect(state, powerUp) {
    animatePlayerScale(state.player);

    switch (powerUp.type) {
        case POWERUP_TYPES.INVULNERABILITY:
            state.isInvulnerable = true;
            state.powerUpTimers.invulnerability = 1800; // 30 segundos
            activarMusicaEspecial(30); // Estrella
            break;

        case POWERUP_TYPES.TRIPLE_SHOT:
            state.tripleShot = true;
            state.powerUpTimers.tripleShot = 1800;
            activarMusicaTemporal(sonidoLuna, 30); // Luna
            break;

        case POWERUP_TYPES.SUPER_MOVE:
            state.superMove = true;
            state.isInvulnerable = true;
            state.powerUpTimers.superMove = 1800;
            activarMusicaTemporal(sonidoCohete, 30); // Cohete
            break;

        case POWERUP_TYPES.SCORE:
            state.score += 250;
            sonidoPunto.currentTime = 0;
            sonidoPunto.play(); // Sonido corto, sin duración
            break;
    }
}

// === COLISIONES ===
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// === GENERAR ALEATORIOS POR NIVEL ===
export function maybeSpawnPowerUpForLevel(state) {
    let type = null;

    if (state.level === 5) type = POWERUP_TYPES.INVULNERABILITY;
    else if (state.level === 10) type = POWERUP_TYPES.TRIPLE_SHOT;
    else if (state.level === 15) type = POWERUP_TYPES.SUPER_MOVE;
    else if (state.level >= 16 && Math.random() < 0.1) {
        const types = [
            POWERUP_TYPES.SCORE,
            POWERUP_TYPES.TRIPLE_SHOT,
            POWERUP_TYPES.SUPER_MOVE,
            POWERUP_TYPES.INVULNERABILITY
        ];
        type = types[Math.floor(Math.random() * types.length)];
    }

    if (type) {
        const x = Math.random() * (state.canvas.width - 24);
        const y = 0;
        spawnPowerUp(x, y, type);
    }
}

// === ANIMACIÓN AL RECOGER ===
function animatePlayerScale(player) {
    const originalWidth = player.width;
    const originalHeight = player.height;

    let growing = true;
    let steps = 0;
    const maxSteps = 10;
    const scaleFactor = 1.5;

    const interval = setInterval(() => {
        if (growing) {
            player.width = originalWidth * scaleFactor;
            player.height = originalHeight * scaleFactor;
            player.x -= (player.width - originalWidth) / 2;
            player.y -= (player.height - originalHeight) / 2;
        } else {
            player.width = originalWidth;
            player.height = originalHeight;
            player.x += (originalWidth * scaleFactor - originalWidth) / 2;
            player.y += (originalHeight * scaleFactor - originalHeight) / 2;
        }

        steps++;
        if (steps >= maxSteps) {
            clearInterval(interval);
        }

        growing = !growing;
    }, 50);
}