//level.js

// Función para aumentar el nivel del juego y ajustar la dificultad
export function increaseLevel(state) {
    state.level++; // Sube el nivel en 1
    console.log(`⏫ Nivel aumentado a: ${state.level}`);

    // Aumentar velocidad de enemigos (¡OJO! Multiplica por 0.001, esto realmente los hace más lentos)
    state.enemies.forEach(enemy => {
        enemy.speedX *= 0.001; // Multiplica la velocidad horizontal por 0.001
        enemy.speedY *= 0.001; // Multiplica la velocidad vertical por 0.001
    });

    // Reduce el intervalo entre disparos enemigos (más disparos a mayor nivel)
    state.baseEnemyShootInterval = Math.max(10, 60 - state.level * 5);

    // Reduce el tiempo entre apariciones de enemigos (más enemigos a mayor nivel)
    state.enemySpawnInterval = Math.max(30, 120 - state.level * 10);
}