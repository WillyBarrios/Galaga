// powerups.js
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

export const POWERUP_TYPES = {
    INVULNERABILITY: 'invulnerability',
    TRIPLE_SHOT: 'triple-shot',
    SUPER_MOVE: 'super-move',
    SCORE: 'score'
};

export const powerUps = [];

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

export function updatePowerUps(state) {
    for (const powerUp of powerUps) {
        powerUp.y += powerUp.speedY;
        if (powerUp.y > state.canvas.height) powerUp.active = false;

        if (
            powerUp.active &&
            checkCollision(powerUp, state.player)
        ) {
            console.log("✅ Power-up recogido:", powerUp.type); 
            applyPowerUpEffect(state, powerUp);
            powerUp.active = false;
        }
    }
    // Limpieza
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (!powerUps[i].active) powerUps.splice(i, 1);
    }
}

export function drawPowerUps(ctx) {
    for (const p of powerUps) {
        const img = powerUpImages[p.type];
        if (img.complete) {
            ctx.drawImage(img, p.x, p.y, p.width, p.height);
        } else {
            // fallback (opcional)
            ctx.fillStyle = 'gray';
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }
}


function getColorForPowerUp(type) {
    switch (type) {
        case POWERUP_TYPES.INVULNERABILITY: return 'gold';
        case POWERUP_TYPES.TRIPLE_SHOT: return 'blue';
        case POWERUP_TYPES.SUPER_MOVE: return 'purple';
        case POWERUP_TYPES.SCORE: return 'white';
    }
}

function applyPowerUpEffect(state, powerUp) {
    console.log("✅ Power-up recogido:", powerUp.type);

    // Animación de agrandamiento tipo Mario
    animatePlayerScale(state.player);

    switch (powerUp.type) {
        case POWERUP_TYPES.INVULNERABILITY:
            state.isInvulnerable = true;
            setTimeout(() => state.isInvulnerable = false, 60000);
            break;
        case POWERUP_TYPES.TRIPLE_SHOT:
            state.tripleShot = true;
            setTimeout(() => state.tripleShot = false, 120000);
            break;
        case POWERUP_TYPES.SUPER_MOVE:
            state.superMove = true;
            state.isInvulnerable = true;
            setTimeout(() => {
                state.superMove = false;
                state.isInvulnerable = false;
            }, 120000);
            break;
        case POWERUP_TYPES.SCORE:
            state.score += 250;
            break;
    }
}


function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
 export function maybeSpawnPowerUpForLevel(state) {
    let type = null;
    if (state.level === 5) type = POWERUP_TYPES.INVULNERABILITY;
    else if (state.level === 10) type = POWERUP_TYPES.TRIPLE_SHOT;
    else if (state.level === 15) type = POWERUP_TYPES.SUPER_MOVE;
    else if (state.level >= 16 && Math.random() < 0.1) {
        const types = [POWERUP_TYPES.SCORE, POWERUP_TYPES.TRIPLE_SHOT, POWERUP_TYPES.SUPER_MOVE, POWERUP_TYPES.INVULNERABILITY];
        type = types[Math.floor(Math.random() * types.length)];
    }

    if (type) {
        const x = Math.random() * (state.canvas.width - 24);
        const y = 0;
        spawnPowerUp(x, y, type);
    }
}

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
    }, 50); // Cambia cada 50ms para una animación rápida
}


