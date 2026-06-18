const grid = document.getElementById('grid');
const viewContainer = document.querySelector('.view-container');

let zoom = 1; 
let offsetX = 0;
let offsetY = 0;
let isCameraDragging = false;
let startX = 0;
let startY = 0;
let transformFrame = null;

function updateTransform() {
    if (transformFrame !== null) return;

    transformFrame = requestAnimationFrame(() => {
        transformFrame = null;
        grid.style.transform = `translate(${offsetX}px, ${offsetY}px) rotateX(60deg) rotateZ(45deg) scale3d(${zoom}, ${zoom}, ${zoom})`;
    });
}

//zom to center of the grid 
viewContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoom +=0.1;
    } else {
        zoom -=0.1;
    }
    zoom = Math.max(0.1, Math.min(zoom, 2)); // Limit zoom between 0.1 and 2
    updateTransform();
});

//Drag camera (lmb down)
viewContainer.addEventListener('mousedown', (e) => {
    isCameraDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    viewContainer.style.cursor = 'grabbing';
});

// stop dragging (lmb up)
document.addEventListener('mouseup', (e) => {
    if (isCameraDragging) {
        isCameraDragging = false;
    viewContainer.style.cursor = 'default';
    }

});

//drag camera (mousemove) ( actual movemnet)
document.addEventListener('mousemove', (e) => {
    if (!isCameraDragging) {
        return;
    }
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    offsetX += dx;
    offsetY += dy;

    startX = e.clientX;
    startY = e.clientY;

    updateTransform();
});

// stop draggin when mouse on the side bar/ tools bar ( prob create a btn like blender that allow drag)
viewContainer.addEventListener('mouseleave', () => {
    if (isCameraDragging) {
        isCameraDragging = false;
        viewContainer.style.cursor = 'default';
    }
});

