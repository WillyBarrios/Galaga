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
export function handleCollisions(state, { onPlayerHit, onEnemyDestroyed,onBossDefeated  } = {}) {
    const { player, enemies, playerProjectiles, enemyProjectiles } = state;

    // Disparos del jugador
    for (let i = 0; i < playerProjectiles.length; i++) {
        const projectile = playerProjectiles[i];

        // Contra enemigos normales
        let hit = false;
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (enemy.alive && checkCollision(projectile, enemy)) {
                enemy.alive = false;
                playerProjectiles.splice(i, 1);
                i--;
                if (onEnemyDestroyed) onEnemyDestroyed(enemy);
                hit = true;
                break; // Ya impactó un enemigo
            }
        }

        if (hit) continue; // No seguir revisando el mismo proyectil

        // Contra el boss
        if (state.bossActive && state.boss && state.boss.active && checkCollision(projectile, state.boss)) {
            state.boss.life--;
            playerProjectiles.splice(i, 1);
            i--;
            console.log(`Boss vida restante: ${state.boss.life}`);

            if (state.boss.life <= 0) {
                state.bossActive = false;
                state.boss.active = false;
                state.score += 1000;
                console.log("🚀 Boss derrotado!");
                state.bossDefeatedActive = true;
                state.bossDefeatedTimer = 180; // 3 segundos
                state.isPaused = true;

                if (onBossDefeated) onBossDefeated();

            }
            break; // Ya impactó al boss
        }
    }

    // Disparos enemigos contra jugador
    for (let i = 0; i < enemyProjectiles.length; i++) {
        const projectile = enemyProjectiles[i];
        if (!state.isInvulnerable && checkCollision(projectile, player)) {
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
            enemy.alive = false;
            if (!state.isInvulnerable && onPlayerHit) onPlayerHit();
            break;
        }
    }

    // Boss colisiona con el jugador
    if (state.bossActive && state.boss && state.boss.active && checkCollision(state.boss, player)) {
        if (!state.isInvulnerable && onPlayerHit) onPlayerHit();
    }
}




