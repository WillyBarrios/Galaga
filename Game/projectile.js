// projectile.js
// --- Disparos del jugador ---
export const playerProjectiles = [];
export const projectileSpeed = -10;
export const projectileWidth = 4;
export const projectileHeight = 10;
export const projectileColor = 'lime';

export function shoot(player) {
    const newProjectile = {
        x: player.x + player.width / 2 - projectileWidth / 2,
        y: player.y,
        width: projectileWidth,
        height: projectileHeight,
        color: projectileColor,
        speedY: projectileSpeed
    };
    playerProjectiles.push(newProjectile);
}

export function updatePlayerProjectiles(canvas) {
    for (let i = 0; i < playerProjectiles.length; i++) {
        playerProjectiles[i].y += playerProjectiles[i].speedY;
        if (playerProjectiles[i].y < 0) {
            playerProjectiles.splice(i, 1);
            i--;
        }
    }
}

export function drawPlayerProjectiles(ctx) {
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

export function updateEnemyProjectiles(canvas) {
    for (let i = 0; i < enemyProjectiles.length; i++) {
        enemyProjectiles[i].y += enemyProjectiles[i].speedY;
        if (enemyProjectiles[i].y > canvas.height) {
            enemyProjectiles.splice(i, 1);
            i--;
        }
    }
}

export function drawEnemyProjectiles(ctx) {
    ctx.fillStyle = enemyProjectileColor;
    for (const projectile of enemyProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

