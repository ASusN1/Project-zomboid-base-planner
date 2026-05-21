const grid = document.getElementById('grid');
const size = 12;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isCameraDragging = false;
let startX = 0;
let startY = 0;

function updateTransform() {
    grid.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotateX(60deg) rotateZ(45deg) `;
}

function createGrid() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            tile.textContent = `${x},${y}`;

            grid.appendChild(tile);
        }
    }
    updateTransform();
}

createGrid();

//zoom to center
//window.addEventListener('wheel', (e) => {
    //e.preventDefault();
  //  if (e.deltaY < 0) {
  //      zoom += 0.1;
    //} else {
   //     zoom -= 0.1;
  //  }
   // zoom = Math.max(0.1, zoom);
  //  updateTransform();
//});

//Zoom toward user mouse cursor 
window.addEventListener('wheel', (e) => {
    e.preventDefault();

    let delta;
    if (e.deltaY < 0) {
        delta = 0.1;
    } else {
        delta = -0.1;
    }

    const newZoom = Math.max(0.1, zoom + delta);

    offsetX = e.clientX - (e.clientX - offsetX) * (newZoom / zoom);
    offsetY = e.clientY - (e.clientY - offsetY) * (newZoom / zoom);

    zoom = newZoom;
    updateTransform();
});

//drag camera 
window.addEventListener('mousedown', (e) => {
    isCameraDragging = true;
    startX= e.clientX;
    startY = e.clientY;

    document.body.style.cursor= 'grabbing';
});

window.addEventListener('mouseup', (e) => {
    isCameraDragging = false;
    document.body.style.cursor= 'default';
});

window.addEventListener('mousemove', (e) => {
    if (!isCameraDragging) return;
    const dx = e.clientX- startX;
    const dy = e.clientY- startY;

    offsetX += dx;
    offsetY += dy;

    startX = e.clientX;
    startY = e.clientY;

    updateTransform();
});