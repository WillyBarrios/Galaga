// Imagen del boss (puedes cambiar la ruta por tu sprite cuando quieras)
const bossImage = new Image();
bossImage.src = 'assets/boss.png';  // Cambia a tu sprite

export function spawnBoss(state) {
    state.boss = {
        x: (state.canvas.width - 120) / 2,
        y: 50,
        width: 120,
        height: 120,
        speedX: 2,
        life: 30,
        maxLife: 30,
        active: true
    };
    state.bossActive = true;
    console.log("🚀 Boss generado");
}

export function updateBoss(state) {
    if (!state.boss || !state.boss.active || state.isPaused) return;

    const boss = state.boss;
    boss.x += boss.speedX;

    if (boss.x < 0 || boss.x + boss.width > state.canvas.width) {
        boss.speedX *= -1;
    }
}

export function drawBoss(ctx, state) {
    const boss = state.boss;
    if (!boss || !boss.active) {
        return;
    }

    if (bossImage.complete && bossImage.naturalWidth !== 0) {
        ctx.drawImage(bossImage, boss.x, boss.y, boss.width, boss.height);
    } else {
        // Fallback: dibuja un rectángulo si no hay sprite cargado
        ctx.fillStyle = 'purple';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    }


    // Barra de vida centrada arriba
    const barWidth = 300;
    const barHeight = 10;
    const barX = state.canvas.width / 2 - barWidth / 2;
    const barY = 10;

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, (boss.life / boss.maxLife) * barWidth, barHeight);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}
