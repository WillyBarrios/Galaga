// powerups.js

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
        width: 24,
        height: 24,
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
        ctx.fillStyle = getColorForPowerUp(p.type);
        ctx.fillRect(p.x, p.y, p.width, p.height);
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

