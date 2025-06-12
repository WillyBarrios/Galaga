// collisions.js

import { player } from './player.js';

import { playerProjectiles, enemyProjectiles } from './projectile.js';

// Función general para checar colisiones entre dos rectángulos
export function checkCollision(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

// Lógica de colisiones principal
export function handleCollisions(state, { onPlayerHit, onEnemyDestroyed } = {}) {
    const { player, enemies, playerProjectiles, enemyProjectiles } = state;

    // Disparos del jugador contra enemigos
    for (let i = 0; i < playerProjectiles.length; i++) {
        const projectile = playerProjectiles[i];
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (enemy.alive && checkCollision(projectile, enemy)) {
                enemy.alive = false;
                playerProjectiles.splice(i, 1);
                i--;
                if (onEnemyDestroyed) onEnemyDestroyed(enemy);
                break;
            }
        }
    }

    // Disparos enemigos contra jugador
    for (let i = 0; i < enemyProjectiles.length; i++) {
        const projectile = enemyProjectiles[i];
        if (checkCollision(projectile, player)) {
            enemyProjectiles.splice(i, 1);
            i--;
            if (onPlayerHit) onPlayerHit();
            break;
        }
    }
    // Enemigos colisionan con el jugador

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (enemy.alive && checkCollision(enemy, player)) {
            enemy.alive = false; // opcional: eliminar al enemigo al chocar
            if (onPlayerHit) onPlayerHit();
            break; // salimos después de una colisión
        }
    }
}

