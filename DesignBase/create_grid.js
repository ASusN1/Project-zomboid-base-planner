const gridSizeInput = document.getElementById('gridSizeInput'); 

// defult grid size = 12*12 (if input <12 --> change to 12) 
let size = Math.max(parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
//if (size <12) size = 12; // force min height/width = 12*12 

window.selectedItem = null; 
window.currentToolusing = 'place'; // default tool is place

window.undoListItem = [];
window.redoListItem = [];

function handleGridClick(e) {
    const tile = e.target.closest('.tile');
    if (!tile || !grid.contains(tile)) return;

    const previousColor = tile.style.backgroundColor;
    let newColor = previousColor;

    if (currentToolusing === 'delete') {
        const tx = tile.dataset.x;
        const ty = tile.dataset.y;
        if (window.tileOwner && window.cubeRegistry) {
            const ownerKey = window.tileOwner.get(`${tx},${ty}`);
            if (ownerKey && window.cubeRegistry.has(ownerKey)) {
                const cube = window.cubeRegistry.get(ownerKey);
                cube.elements.forEach(({ el }) => {
                    try { el.remove(); } catch (e) {}
                });
                cube.tiles.forEach(t => {
                    if (!t) return;
                    t.style.backgroundColor = '';
                    window.tileOwner.delete(`${t.dataset.x},${t.dataset.y}`);
                });
                window.cubeRegistry.delete(ownerKey);
                return;
            }
        }

        const existingCube = tile.querySelector('.cube-object');
        if (existingCube) existingCube.remove();
        newColor = '';
    } else if (currentToolusing === 'place' && selectedItem) {
        if (selectedItem.type === 'wall') {
            return;
        } else if (selectedItem.type === 'cube') {
            placeCubeOnGrid(tile, selectedItem);
            return;
        }
        newColor = selectedItem.color;
    } else {
        return;
    }

    if (newColor !== previousColor) {
        tile.style.backgroundColor = newColor;
        undoListItem.push({
            undo() { tile.style.backgroundColor = previousColor; },
            redo() { tile.style.backgroundColor = newColor; },
        });
        redoListItem = [];
    }
}

grid.addEventListener('click', handleGridClick);

function createGrid() {
    grid.innerHTML = '';

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const fragment = document.createDocumentFragment();

    for (let x = 0; x < size; x++) {
        for(let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.dataset.z = 0; // default z level for grid tile
            tile.textContent = `${x},${y}, ${tile.dataset.z}`; // for debugging, shows coordinates on tile
            fragment.appendChild(tile);
        }
    }

    grid.appendChild(fragment);

updateTransform();
}

gridSizeInput.addEventListener('change', () => {
    size = Math.max(parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
    gridSizeInput.value = size; 

    undoListItem = [];
    redoListItem = [];

    createGrid();
});

createGrid();
