// projectile.js

// --- Disparos del jugador ---

export const playerProjectiles = [];      // Arreglo global de proyectiles del jugador
export const projectileSpeed = -10;       // Velocidad vertical de los disparos del jugador (hacia arriba)
export const projectileWidth = 4;         // Ancho del disparo
export const projectileHeight = 10;       // Alto del disparo
export const projectileColor = 'lime';    // Color del disparo

// Función para disparar un proyectil simple desde la nave del jugador
export function shoot(state) {
    const player = state.player;
    const newProjectile = {
        x: player.x + player.width / 2 - projectileWidth / 2, // Centrado en la nave
        y: player.y,
        width: projectileWidth,
        height: projectileHeight,
        color: projectileColor,
        speedY: projectileSpeed
    };
    state.playerProjectiles.push(newProjectile); // Agrega el disparo al arreglo
}

// Actualiza la posición de los disparos del jugador y elimina los que salen de pantalla
export function updatePlayerProjectiles(state) {
    for (let i = 0; i < state.playerProjectiles.length; i++) {
        state.playerProjectiles[i].y += state.playerProjectiles[i].speedY;
        if (state.playerProjectiles[i].y < 0) { // Si sale por arriba
            state.playerProjectiles.splice(i, 1); // Elimina el disparo
            i--;
        }
    }
}

// Dibuja todos los disparos del jugador en el canvas
export function drawPlayerProjectiles(state) {
    const ctx = state.ctx;
    ctx.fillStyle = projectileColor;
    for (const projectile of playerProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

// --- Disparos enemigos ---

export const enemyProjectiles = [];           // Arreglo global de proyectiles enemigos
export const enemyProjectileSpeed = 5;        // Velocidad vertical de los disparos enemigos (hacia abajo)
export const enemyProjectileWidth = 4;        // Ancho del disparo enemigo
export const enemyProjectileHeight = 10;      // Alto del disparo enemigo
export const enemyProjectileColor = 'red';    // Color del disparo enemigo

// Función para que un enemigo dispare un proyectil
export function enemyShoot(enemy) {
    const newProjectile = {
        x: enemy.x + enemy.width / 2 - enemyProjectileWidth / 2, // Centrado en el enemigo
        y: enemy.y + enemy.height,
        width: enemyProjectileWidth,
        height: enemyProjectileHeight,
        color: enemyProjectileColor,
        speedY: enemyProjectileSpeed
    };
    enemyProjectiles.push(newProjectile); // Agrega el disparo al arreglo
}

// Actualiza la posición de los disparos enemigos y elimina los que salen de pantalla
export function updateEnemyProjectiles(state) {
    for (let i = 0; i < state.enemyProjectiles.length; i++) {
        state.enemyProjectiles[i].y += state.enemyProjectiles[i].speedY;
        if (state.enemyProjectiles[i].y > state.canvas.height) { // Si sale por abajo
            state.enemyProjectiles.splice(i, 1); // Elimina el disparo
            i--;
        }
    }
}

// Dibuja todos los disparos enemigos en el canvas
export function drawEnemyProjectiles(ctx, state) {
    ctx.fillStyle = 'red';
    for (const projectile of state.enemyProjectiles) {
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}

// --- Disparo triple del jugador (power-up) ---

// Función para disparar tres proyectiles a la vez (power-up)
export function shootTriple(state) {
    const player = state.player;

    const offsets = [-10, 0, 10]; // 3 disparos con un poco de separación horizontal
    for (let dx of offsets) {
        playerProjectiles.push({
            x: player.x + player.width / 2 - projectileWidth / 2 + dx,
            y: player.y,
            width: projectileWidth,
            height: projectileHeight,
            color: projectileColor, // Cambiar el color si se desea
            speedY: projectileSpeed
        });
    }
}