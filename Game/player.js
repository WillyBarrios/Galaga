// player.js
const playerImage = new Image();
playerImage.src = 'assets/Diseño sin título/1.png';

export const player = {
    x: 0, // se inicializa en main.js para adaptarse al tamaño del canvas
    y: 0,
    width: 32,
    height: 32,
    speed: 5,
    image: playerImage
};

export function initPlayer(canvas) {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
}

export function movePlayer(keys, canvas) {
    if (keys['ArrowLeft'] || keys['a']) {
        player.x -= player.speed;
        if (player.x < 0) player.x = 0;
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x += player.speed;
        if (player.x > canvas.width - player.width) {
            player.x = canvas.width - player.width;
        }
    }
}

export function drawPlayer(ctx, player) {
    if (player.image instanceof HTMLImageElement && player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        console.warn("⛔ Imagen del jugador no es válida todavía.");
    }
}


