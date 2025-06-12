// enemy.js
export const enemyWidth = 32;
export const enemyHeight = 32;
export const enemySpeedXRandom = 0.5;
export const enemySpeedYRandom = 0.5;

export let enemies = [];

export function spawnEnemyGroup(canvasWidth, canvasHeight) {
    for (let i = 0; i < 3; i++) {
        const randomX = Math.random() * (canvasWidth - enemyWidth);
        const randomY = Math.random() * (canvasHeight * 0.3);
        const speedX = (Math.random() - 0.5) * 2 * enemySpeedXRandom;
        const speedY = Math.random() * enemySpeedYRandom;

        enemies.push({
            x: randomX,
            y: randomY,
            width: enemyWidth,
            height: enemyHeight,
            alive: true,
            speedX: speedX,
            speedY: speedY
        });
    }
}

export function updateEnemies(canvasWidth, canvasHeight) {
    for (const enemy of enemies) {
        if (enemy.alive) {
            enemy.x += enemy.speedX;
            enemy.y += enemy.speedY;

            if (enemy.x < 0 || enemy.x + enemyWidth > canvasWidth) {
                enemy.speedX *= -1;
            }
            if (enemy.y > canvasHeight) {
                enemy.alive = false;
            }
        }
    }

    enemies = enemies.filter(enemy => enemy.alive);
}

export function drawEnemies(ctx, enemyImage) {
    for (const enemy of enemies) {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}
