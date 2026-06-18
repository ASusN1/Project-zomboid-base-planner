window.floorLayers = ['Layer 0']; 
window.currentLayerIndex = 0;

const layerList = document.getElementById('LayerList');
const moveUpButton = document.getElementById('moveUpFloorLayer');
const moveDownButton = document.getElementById('moveDownFloorLayer');
const addNewLayer = document.getElementById('addNewLayer');
const deleteLayer = document.getElementById('deleteLayer');

function renderLayerList() {
    layerList.innerHTML = '';
    
    for (let i = floorLayers.length - 1; i >= 0; i--) {
        const item = document.createElement('li');
        item.className = 'Layer-list-item';

        if (i === currentLayerIndex) item.classList.add('active');
        item.textContent = floorLayers[i];
        item.dataset.layerIndex = i; 

        item.addEventListener('click', () => {
            currentLayerIndex = i;
            renderLayerList();
        });

        layerList.appendChild(item);
    }
}

addNewLayer.addEventListener('click', () => {
    const newLayerName = `Layer ${floorLayers.length}`;
    floorLayers.push(newLayerName);
    currentLayerIndex = floorLayers.length - 1;
    renderLayerList();
});

deleteLayer.addEventListener('click', () => {
    if (floorLayers.length <= 1) return;
    floorLayers.splice(currentLayerIndex, 1);
    currentLayerIndex = Math.max(0, currentLayerIndex - 1);
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
