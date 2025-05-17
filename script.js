const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
    // Aquí irá la lógica principal del juego que se ejecutará en cada frame
    update();
    draw();
    requestAnimationFrame(gameLoop); // Solicita el próximo frame para la animación
}

function update() {
    // Actualiza el estado del juego (posición de los objetos, colisiones, etc.)
}

function draw() {
    // Dibuja los elementos del juego en el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas en cada frame
    // Por ahora, podrías dibujar un simple rectángulo para probar
    ctx.fillStyle = 'white';
    ctx.fillRect(50, 50, 20, 20);
}

// Inicia el bucle del juego
gameLoop();