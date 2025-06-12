// enemy.js

export const enemyWidth = 32;
export const enemyHeight = 32;
export const enemySpeedXRandom = 1.5;
export const enemySpeedYRandom = 1.0;

export function spawnEnemyGroup(canvasWidth, canvasHeight, state) {
    const groupSize = 5;
    const minSpeed = 0.5;

    for (let i = 0; i < groupSize; i++) {
        const randomX = Math.random() * (canvasWidth - enemyWidth);
        const randomY = Math.random() * (canvasHeight * 0.3);
        let speedX = (Math.random() - 0.5) * 2 * enemySpeedXRandom;
        let speedY = Math.random() * enemySpeedYRandom;

        // Asegurar que no estén estáticos
        if (Math.abs(speedX) < minSpeed) speedX = minSpeed * Math.sign(speedX || 1);
        if (Math.abs(speedY) < minSpeed) speedY = minSpeed;

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

export function updateEnemies(canvasWidth, canvasHeight, state) {
    for (const enemy of state.enemies) {
        if (enemy.alive) {
            enemy.x += enemy.speedX;
            enemy.y += enemy.speedY;

            if (enemy.x < 0 || enemy.x + enemy.width > canvasWidth) {
                enemy.speedX *= -1;
            }
            if (enemy.y > canvasHeight) {
                enemy.alive = false;
            }
        }
    }

    // Elimina los muertos
    state.enemies = state.enemies.filter(enemy => enemy.alive);
}

export const enemyImage = new Image();
enemyImage.src = 'assets/Diseño sin título/nivel 1.png';
enemyImage.onload = () => {
    console.log("✅ Imagen de enemigo cargada.");
};

export function drawEnemies(ctx, state) {
    for (const enemy of state.enemies) {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}


