window.floorLayers = [{
    name: 'Layer 0',
    gridHTML: '',
    cubeRegistry: new Map(),
    CubeOnTheTile: new Map(), 
    undoListItem: [],
    redoListItem: [],
}]; 

window.currentLayerIndex = 0; // Remember to update this index when layers are added, removed, or reordered

const layerList = document.getElementById('LayerList');
const moveUpButton = document.getElementById('moveUpFloorLayer');
const moveDownButton = document.getElementById('moveDownFloorLayer');
const addNewLayer = document.getElementById('addNewLayer');
const deleteLayer = document.getElementById('deleteLayer');

function saveCurrentLayerData() { 
    const current = floorLayers[currentLayerIndex];
    current.gridHTML = grid.innerHTML; 
    current.cubeRegistry= window.cubeRegistry;
    current.CubeOnTheTile = window.CubeOnTheTile;
    current.undoListItem = window.undoListItem;
    current.redoListItem = window.redoListItem;
}

function loadLayerData(index) {
    const Loadlayer = floorLayers[index];
    grid.innerHTML = Loadlayer.gridHTML;
    window.cubeRegistry = Loadlayer.cubeRegistry;
    window.CubeOnTheTile = Loadlayer.CubeOnTheTile;
    window.undoListItem = Loadlayer.undoListItem;
    window.redoListItem = Loadlayer.redoListItem;

    grid.querySelectorAll('.tile').forEach(tile=> {
        attachTileClickListener(tile); 
    });
}


function renderLayerList() {
    layerList.innerHTML = '';
    
    for (let i = floorLayers.length - 1; i >= 0; i--) {
        const item = document.createElement('li');
        item.className = 'Layer-list-item';

        if (i === currentLayerIndex) item.classList.add('active');
        item.textContent = floorLayers[i].name;
        item.dataset.layerIndex = i; 

        item.addEventListener('click', () => {
            saveCurrentLayerData();
            currentLayerIndex = i;
            loadLayerData(i);
            renderLayerList();
        });

        layerList.appendChild(item);
    }
}

addNewLayer.addEventListener('click', () => {
    saveCurrentLayerData();
    const newLayer = {
        name: `Layer ${floorLayers.length}`,
        gridHTML: '',
        cubeRegistry: new Map(),
        CubeOnTheTile: new Map(),
        undoListItem: [],
        redoListItem: [],
    };

    floorLayers.push(newLayer);
    currentLayerIndex = floorLayers.length - 1;
    window.cubeRegistry = newLayer.cubeRegistry;
    window.CubeOnTheTile = newLayer.CubeOnTheTile;
    window.tileOwner = newLayer.CubeOnTheTile;
    window.undoListItem = newLayer.undoListItem;
    window.redoListItem = newLayer.redoListItem;
    createGrid();
    renderLayerList();
});

deleteLayer.addEventListener('click', () => {
    if (floorLayers.length <= 1) return;

    floorLayers.splice(currentLayerIndex, 1);
    currentLayerIndex = Math.max(0, currentLayerIndex - 1);

    loadLayerData(currentLayerIndex);
    renderLayerList();
});

moveUpButton.addEventListener('click', () => {
    if (currentLayerIndex >= floorLayers.length - 1) return;

    const temp = floorLayers[currentLayerIndex];
    floorLayers[currentLayerIndex] = floorLayers[currentLayerIndex + 1];
    floorLayers[currentLayerIndex + 1] = temp;
    currentLayerIndex++;
    renderLayerList();
});

moveDownButton.addEventListener('click', () => {
    if (currentLayerIndex <= 0) return;

    const temp = floorLayers[currentLayerIndex];

    floorLayers[currentLayerIndex] = floorLayers[currentLayerIndex - 1];
    floorLayers[currentLayerIndex - 1] = temp;
    currentLayerIndex--;

    renderLayerList();
});

renderLayerList();
