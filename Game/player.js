// player.js

// Carga la imagen del jugador
const playerImage = new Image();
playerImage.src = 'assets/Diseño sin título/1.png';

// Objeto jugador con sus propiedades iniciales
export const player = {
    x: 0, // Se inicializa en main.js para adaptarse al tamaño del canvas
    y: 0,
    width: 32,
    height: 32,
    speed: 4, // Ajustar aquí la velocidad del jugador
    image: playerImage
};

// Inicializa la posición del jugador en el canvas (centrado abajo)
export function initPlayer(canvas) {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
}

// Mueve al jugador según las teclas presionadas y el estado del juego
export function movePlayer(keys, state) {
    const { player, canvas, superMove } = state;

    // Movimiento horizontal básico
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

    // Movimiento vertical solo si está activo el super-move (power-up)
    if (superMove) {
        if (keys['ArrowUp'] || keys['w']) {
            player.y -= player.speed;
            if (player.y < 0) player.y = 0;
        }
        if (keys['ArrowDown'] || keys['s']) {
            player.y += player.speed;
            if (player.y > canvas.height - player.height) {
                player.y = canvas.height - player.height;
            }
        }
    }

    // Inversión de controles en el nivel 15
    const invert = state.level === 15;

    // Movimiento horizontal con inversión de controles si corresponde
    if ((keys['ArrowLeft'] || keys['a'])) {
        if (invert) {
            player.x += player.speed;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        } else {
            player.x -= player.speed;
            if (player.x < 0) player.x = 0;
        }
    }
    if ((keys['ArrowRight'] || keys['d'])) {
        if (invert) {
            player.x -= player.speed;
            if (player.x < 0) player.x = 0;
        } else {
            player.x += player.speed;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        }
    }

    // Movimiento vertical con inversión de controles si corresponde y super-move activo
    if (state.superMove) {
        if ((keys['ArrowUp'] || keys['w'])) {
            if (invert) {
                player.y += player.speed;
                if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
            } else {
                player.y -= player.speed;
                if (player.y < 0) player.y = 0;
            }
        }
        if ((keys['ArrowDown'] || keys['s'])) {
            if (invert) {
                player.y -= player.speed;
                if (player.y < 0) player.y = 0;
            } else {
                player.y += player.speed;
                if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
            }
        }
    }
}

// Dibuja la nave del jugador en el canvas
export function drawPlayer(ctx, player) {
    if (player.image instanceof HTMLImageElement && player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        console.warn("⛔ Imagen del jugador no es válida todavía.");
    }
}