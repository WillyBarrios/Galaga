// enemy.js

export const enemyWidth = 32;              // Ancho de cada enemigo
export const enemyHeight = 32;             // Alto de cada enemigo
export const enemySpeedXRandom = 1.5;      // Máxima velocidad horizontal aleatoria
export const enemySpeedYRandom = 1.0;      // Máxima velocidad vertical aleatoria

// Función para generar un grupo de enemigos en posiciones y velocidades aleatorias
export function spawnEnemyGroup(canvasWidth, canvasHeight, state) {
    const groupSize = 5;   // Número de enemigos por grupo
    const minSpeed = 0.5;  // Velocidad mínima para que no queden estáticos

    for (let i = 0; i < groupSize; i++) {
        const randomX = Math.random() * (canvasWidth - enemyWidth);        // Posición X aleatoria
        const randomY = Math.random() * (canvasHeight * 0.3);              // Posición Y aleatoria (parte superior)
        let speedX = (Math.random() - 0.5) * 2 * enemySpeedXRandom;        // Velocidad X aleatoria (puede ser negativa)
        let speedY = Math.random() * enemySpeedYRandom;                    // Velocidad Y aleatoria

        // Asegura que la velocidad no sea demasiado baja (para que siempre se muevan)
        if (Math.abs(speedX) < minSpeed) speedX = minSpeed * Math.sign(speedX || 1);
        if (Math.abs(speedY) < minSpeed) speedY = minSpeed;

        // Agrega el enemigo al arreglo global de enemigos
        state.enemies.push({
            x: randomX,
            y: randomY,
            width: enemyWidth,
            height: enemyHeight,
            alive: true,
            speedX,
            speedY
        });
    }
}

// Función para actualizar la posición y estado de todos los enemigos
export function updateEnemies(canvasWidth, canvasHeight, state) {
    for (const enemy of state.enemies) {
        if (enemy.alive) {
            enemy.x += enemy.speedX; // Mueve horizontalmente
            enemy.y += enemy.speedY; // Mueve verticalmente

            // Rebota si toca los bordes laterales del canvas
            if (enemy.x < 0 || enemy.x + enemy.width > canvasWidth) {
                enemy.speedX *= -1;
            }
            // Si sale por abajo del canvas, se marca como muerto
            if (enemy.y > canvasHeight) {
                enemy.alive = false;
            }
        }
    }

    // Elimina del arreglo los enemigos que ya no están vivos
    state.enemies = state.enemies.filter(enemy => enemy.alive);
}

// Imagen global para los enemigos
export const enemyImage = new Image();
enemyImage.src = 'assets/Diseño sin título/nivel 1.png';
enemyImage.onload = () => {
    console.log("✅ Imagen de enemigo cargada.");
};

// Dibuja todos los enemigos vivos en el canvas
export function drawEnemies(ctx, state) {
    for (const enemy of state.enemies) {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}