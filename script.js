const grid = document.getElementById('grid');
const size = 12;
let zoom = 1;

function createGrid() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            tile.textContent = `${x},${y}`;

            grid.appendChild(tile);
        }
    }
}

createGrid();

window.addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {
        zoom += 0.1;
    } else {
        zoom -= 0.1;
    }
    grid.style.transform = `rotateX(60deg) rotateZ(45deg) scale(${zoom})`;
});