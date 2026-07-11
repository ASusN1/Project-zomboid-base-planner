function rebuildLayerOnGrid(savedLayerData) {

    // restore floor colors and walls
    for (const [tileCoords, tileContent] of Object.entries(savedLayerData.tiles || {})) {
        const [x, y] = tileCoords.split(',');
        const tile = document.querySelector('.tile[data-x="' + x + '"][data-y="' + y + '"]');
        if (!tile) continue;

        if (tileContent.floor) tile.style.backgroundColor = tileContent.floor; // repaint floor color

        (tileContent.walls || []).forEach(wallInfo => {
            placeWallTile(tile, wallInfo.color, wallInfo.direction, wallInfo.height, wallInfo.name); // replace each wall
        });
    }

    // restore cubess
    (savedLayerData.cubes || []).forEach(cubeInfo => {
        const tile = document.querySelector('.tile[data-x="' + cubeInfo.x + '"][data-y="' + cubeInfo.y + '"]');
        if (!tile) return;
        const itemObject = { color: cubeInfo.color, x: cubeInfo.w, y: cubeInfo.h, z: cubeInfo.d, type: 'cube' };
        placeCubeOnGrid(tile, itemObject, cubeInfo.z); // replace each cube
    });
}

function loadBaseDesignFromJson() {
    const fileInput = document.createElement('input'); 
    fileInput.type = 'file';
    fileInput.accept = '.json'; // only allow json files

    fileInput.addEventListener('change', () => {
        const selectedFile = fileInput.files[0];
        if (!selectedFile) return;

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const saveData = JSON.parse(e.target.result); 

            if (!saveData || !saveData.layers) {
                console.warn('[LOAD] Invalid save file');
                return;
            }

            // restore the design name
            document.getElementById('designBaseName').textContent = saveData.designName || 'My Base';

            const activeLayerIndex = Math.min(saveData.currentLayerIndex || 0, saveData.layers.length - 1);

            
            const layerBuildOrder = saveData.layers.map((_, i) => i).filter(i => i !== activeLayerIndex);
            layerBuildOrder.push(activeLayerIndex);

            //Create floor layer with its data 
            window.floorLayers = saveData.layers.map(savedLayer => ({
                name: savedLayer.name,
                gridSize: savedLayer.gridSize,
                gridHTML: '',
                cubeRegistry: new Map(),
                CubeOnTheTile: new Map(),
                undoListItem: [],
                redoListItem: [],
            }));

            layerBuildOrder.forEach(i => {
                const savedLayerData = saveData.layers[i];
                const freshLayer = window.floorLayers[i];

                
                window.cubeRegistry.clear();
                window.CubeOnTheTile.clear();

                window.size = savedLayerData.gridSize; 
                createGrid(); 
                rebuildLayerOnGrid(savedLayerData); 

                freshLayer.gridHTML = grid.innerHTML; 

                // snapshot cube.js internal Maps into this layer's storage
                window.cubeRegistry.forEach((v, k) => freshLayer.cubeRegistry.set(k, v));
                window.CubeOnTheTile.forEach((v, k) => freshLayer.CubeOnTheTile.set(k, v));

                // discard undo/redo — load actions shouldn't be undoable
                window.undoListItem.length = 0;
                window.redoListItem.length = 0;
            });

            window.currentLayerIndex = activeLayerIndex;
            loadLayerData(activeLayerIndex); 
            renderLayerList(); 

            console.log('[LOAD] Loaded: ' + saveData.designName + ', layers: ' + floorLayers.length);
        };

        fileReader.readAsText(selectedFile); 
    });

    fileInput.click(); 
}

window.loadBaseDesignFromJson = loadBaseDesignFromJson;