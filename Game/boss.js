//boss.js

// Carga la imagen del jefe (boss)
const bossImage = new Image();
bossImage.src = 'assets/boss.png';  // Cambia a tu sprite

// Función para crear y posicionar al jefe en el estado del juego
export function spawnBoss(state) {
    state.boss = {
        x: (state.canvas.width - 120) / 2, // Centrado horizontalmente
        y: 50,                             // Posición vertical fija
        width: 120,                        // Ancho del boss
        height: 120,                       // Alto del boss
        speedX: 2,                         // Velocidad horizontal
        life: 30,                          // Vida actual del boss
        maxLife: 30,                       // Vida máxima del boss
        active: true                       // Marca como activo
    };
    state.bossActive = true;               // Marca el estado global de boss activo
    console.log("🚀 spawnBoss fue llamado");
    console.log("Boss generado:", state.boss);
}

// Función para actualizar la posición y acciones del jefe
export function updateBoss(state) {
    console.log("Boss object:", state.boss);
    console.log("Boss active:", state.boss?.active);

    // Si no hay boss, está inactivo o el juego está en pausa, no hace nada
    if (!state.boss || !state.boss.active || state.isPaused) {
        console.log("⛔ updateBoss no hace nada (pausa, boss inactivo o no existe)");
        return;
    }

    const boss = state.boss;
    boss.x += boss.speedX; // Mueve el boss horizontalmente

    // Rebota si toca los bordes laterales del canvas
    if (boss.x < 0 || boss.x + boss.width > state.canvas.width) {
        boss.speedX *= -1;
    }

    // Inicializa el temporizador de disparo si no existe
    if (!boss.shootTimer) boss.shootTimer = 0;
    boss.shootTimer++;
    // Dispara cada 90 frames
    if (boss.shootTimer >= 90) {
        bossShoot(state);
        boss.shootTimer = 0;
    }
}

// Dibuja al jefe en el canvas y su barra de vida
export function drawBoss(ctx, state) {
    const boss = state.boss;
    if (!boss || !boss.active) {
        return;
    }

    // Si la imagen está cargada, la dibuja; si no, dibuja un rectángulo púrpura
    if (bossImage.complete && bossImage.naturalWidth !== 0) {
        ctx.drawImage(bossImage, boss.x, boss.y, boss.width, boss.height);
    } else {
        ctx.fillStyle = 'purple';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    }

    // Barra de vida centrada arriba del canvas
    const barWidth = 300;
    const barHeight = 10;
    const barX = state.canvas.width / 2 - barWidth / 2;
    const barY = 10;

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, (boss.life / boss.maxLife) * barWidth, barHeight);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

// Función para que el jefe dispare un proyectil especial
export function bossShoot(state) {
    const boss = state.boss;
    if (!boss) return;

    const projectile = {
        x: boss.x + boss.width / 2 - 10, // Centra la bola respecto al boss
        y: boss.y + boss.height,         // Sale desde la parte inferior del boss
        width: 20,
        height: 20,
        speedY: 4,                       // Velocidad vertical del disparo
        color: 'yellow',
    };

    // Inicializa el arreglo de proyectiles del boss si no existe
    if (!state.bossProjectiles) {
        state.bossProjectiles = [];
    }
    state.bossProjectiles.push(projectile); // Agrega el disparo al arreglo
}

// Dibuja los proyectiles del jefe en el canvas
export function drawBossProjectiles(ctx, state) {
    if (!state.bossProjectiles) return;
    ctx.fillStyle = 'orange';
    for (const proj of state.bossProjectiles) {
        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, proj.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}