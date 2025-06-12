export function increaseLevel(state) {
    state.level++;
    console.log(`⏫ Nivel aumentado a: ${state.level}`);

    // Aumentar velocidad de enemigos
    state.enemies.forEach(enemy => {
        enemy.speedX *= 1.2;
        enemy.speedY *= 1.2;
    });

    // Reducir intervalo de disparo enemigo
    state.baseEnemyShootInterval = Math.max(10, 60 - state.level * 5);

    // Reducir tiempo entre apariciones
    state.enemySpawnInterval = Math.max(30, 120 - state.level * 10);
}
