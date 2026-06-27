const gridSizeInput = document.getElementById('gridSizeInput'); 

// defult grid size = 12*12 (if input <12 --> change to 12) 
window.size = Math.max(parseInt(gridSizeInput.value) || 12);
if (window.size > 100) window.size = 100; 

window.selectedItem = null; 
window.currentToolusing = 'place'; // default tool is place

window.undoListItem = [];
window.redoListItem = [];

function attachTileClickListener(tile) {
    tile.addEventListener('click', () => {
        const previousColor = tile.style.backgroundColor; // Store the previous color for undo
        let newColor = previousColor; // Default to previous color if no change

        if (currentToolusing === 'delete') {
            // remove the cube if exists , later must change so that it will remove the cube from highest (z = 3 ( max height)
            const tx = tile.dataset.x;
            const ty = tile.dataset.y;
            if (window.tileOwner && window.cubeRegistry) {
                const ownerKey = window.tileOwner.get(`${tx},${ty}`);
                if (ownerKey && window.cubeRegistry.has(ownerKey)) {
                    const cube = window.cubeRegistry.get(ownerKey);
                    // remove all rendered elements
                    cube.elements.forEach(({ el, parent }) => {
                        try { el.remove(); } catch (e) {}
                    });
                    // clear floor and tileOwner entries
                    cube.tiles.forEach(t => {
                        if (!t) return;
                        t.style.backgroundColor = '';
                        window.tileOwner.delete(`${t.dataset.x},${t.dataset.y}`);
                    });
                    window.cubeRegistry.delete(ownerKey);
                    return;
                }
            }
            // fallback: remove any tiny marker placed on tile
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
            window.undoListItem.push({
                undo() { tile.style.backgroundColor = previousColor; },
                redo() { tile.style.backgroundColor = newColor; },
            });
            window.redoListItem.length = 0;
        }
    });
}
window.attachTileClickListener = attachTileClickListener; // expose to global for use in createGrid

function createGrid() {
    grid.innerHTML = '';

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for(let x = 0; x < size; x++) {
        for(let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.dataset.z = 0; // default z level for tile
            tile.textContent = `${x},${y}, ${tile.dataset.z}`; // for debugging

            attachTileClickListener(tile);

            grid.appendChild(tile);
        }
    }

    updateTransform();
}

gridSizeInput.addEventListener('change', () => {
    size = Math.max(parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
    gridSizeInput.value = size; 
    floorLayers[currentLayerIndex].gridSize = size; // update current layer's grid size

    window.undoListItem = [];
    window.redoListItem = [];

    createGrid();
});

createGrid();
