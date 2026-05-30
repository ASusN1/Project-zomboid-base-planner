const gridSizeInput = document.getElementById('gridSizeInput'); 

// defult grid size = 12*12 (if input <12 --> change to 12) 
let size = Math.max(12, parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
if (size <12) size = 12; // force min height/width = 12*12 

window.selectedItem = null; 
window.currentToolusing = 'place'; // default tool is place

window.undoListItem = [];
window.redoListItem = [];

function createGrid() {
    grid.innerHTML = '';

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let x = 0; x < size; x++) {
        for(let y = 0; y < size; y++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            tile.textContent = `${x},${y}`;

            //change color of the selected tile with the color of the tile ( later must change to Gras_land.png)
            tile.addEventListener('click', () => {
                const previousColor = tile.style.backgroundColor; // Store the previous color for undo
                let newColor = previousColor; // Default to previous color if no change

                if (currentToolusing ==='delete'){
                    newColor = '';
                }else if (currentToolusing === 'place' && selectedItem) {
                    newColor = selectedItem.color;
                }else {
                    return;
                }

                if (newColor !== previousColor) {
                    tile.style.backgroundColor = newColor;
                    undoListItem.oush({tile, previousColor, newColor});
                    redoListItem = [];
                }
            });

            grid.appendChild(tile);
        }
    }

updateTransform();
}

gridSizeInput.addEventListener('change', () => {
    size = Math.max(12, parseInt(gridSizeInput.value) || 12); // default to 12 if invalid input
    gridSizeInput.value = size; 

    undoListItem = [];
    redoListItem = [];

    createGrid();
});

createGrid();
