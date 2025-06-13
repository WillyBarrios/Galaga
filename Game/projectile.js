// projectile.js
// --- Disparos del jugador ---
export const playerProjectiles = [];
export const projectileSpeed = -10;
export const projectileWidth = 4;
export const projectileHeight = 10;
export const projectileColor = 'lime';

export function shoot(state) {
    const player = state.player;
    const newProjectile = {
        x: player.x + player.width / 2 - projectileWidth / 2,
        y: player.y,
        width: projectileWidth,
        height: projectileHeight,
        color: projectileColor,
        speedY: projectileSpeed
    };
    state.playerProjectiles.push(newProjectile);
}


export function updatePlayerProjectiles(state) {
    for (let i = 0; i < state.playerProjectiles.length; i++) {
        state.playerProjectiles[i].y += state.playerProjectiles[i].speedY;
        if (state.playerProjectiles[i].y < 0) {
            state.playerProjectiles.splice(i, 1);
            i--;
        }
    }
}

export function drawPlayerProjectiles(state) {
    const ctx = state.ctx;
    ctx.fillStyle = projectileColor;
    for (const projectile of playerProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

// --- Disparos enemigos ---
export const enemyProjectiles = [];
export const enemyProjectileSpeed = 5;
export const enemyProjectileWidth = 4;
export const enemyProjectileHeight = 10;
export const enemyProjectileColor = 'red';

export function enemyShoot(enemy) {
    const newProjectile = {
        x: enemy.x + enemy.width / 2 - enemyProjectileWidth / 2,
        y: enemy.y + enemy.height,
        width: enemyProjectileWidth,
        height: enemyProjectileHeight,
        color: enemyProjectileColor,
        speedY: enemyProjectileSpeed
    };
    enemyProjectiles.push(newProjectile);
}

export function updateEnemyProjectiles(state) {
    for (let i = 0; i < state.enemyProjectiles.length; i++) {
        state.enemyProjectiles[i].y += state.enemyProjectiles[i].speedY;
        if (state.enemyProjectiles[i].y > state.canvas.height) {
            state.enemyProjectiles.splice(i, 1);
            i--;
        }
    }
}

export function drawEnemyProjectiles(ctx, state) {
    ctx.fillStyle = 'red';
    for (const projectile of state.enemyProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

export function shootTriple(state) {
    const player = state.player;

    const offsets = [-10, 0, 10]; // 3 disparos con un poco de separación
    for (let dx of offsets) {
        playerProjectiles.push({
            x: player.x + player.width / 2 - projectileWidth / 2 + dx,
            y: player.y,
            width: projectileWidth,
            height: projectileHeight,
            color: projectileColor,
            speedY: projectileSpeed
        });
    }
}
