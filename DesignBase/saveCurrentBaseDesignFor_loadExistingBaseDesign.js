const heightOfObject = { 
    '60px': 'small', 
    '90px': 'medium',
    '120px': 'large'
}

// Reads every tiles and return the coordinate of the tiles have smt on them
function extractTilesFromBaseDesign (containerEl, cubeOnTheTileMap) {
    const savedTiles = {}

    containerEl.querySelectorAll('.tile').forEach(tile => {
        const x = tile.dataset.x
        const y = tile.dataset.y
        const savedTileContent = {}; 

        //Check for cube on the tiles ( at z = 0 )
        const cubeOccupiesTile = cubeOnTheTileMap && cubeOnTheTileMap.has(x + ',' + y + ', 0');
        if (!cubeOccupiesTile && tile.style.backgroundColor) { 
            savedTileContent.floor = tile.style.backgroundColor; 
        }

        const wallElements = tile.querySelectorAll('.wall-face');
        if (wallElements.length > 0 ){
            savedTileContent.walls = []; 
            wallElements.forEach(wall => {
                const directionClass = [...wall.classList].find(c=> c.startsWith('wall-direction-'));
                
                if(!directionClass) return 

                const wallDirection = directionClass.replace('wall-direction-', '');
                const isEastOrWestWall = wallDirection =='E' || wallDirection == 'W';
                const heightINPixels = isEastOrWestWall ? wall.style.width: wall.style.height;

                savedTileContent.walls.push({ 
                    direction: wallDirection,
                    color: wall.style.backgroundColor, 
                    height: heightOfObject[heightINPixels] || 'small',
                    name: wall.dataset.itemName
                });
            });
        }

        if(Object.keys(savedTileContent).length > 0 ) { 
            savedTiles[x + ',' + y] = savedTileContent;
        }
    });

    return savedTiles;
} 


function readCubeDataFromBaseDesign (cubeRegistryMap) {
    const savedCube = []; 
    cubeRegistryMap.forEach(cube => {
        savedCube.push({
            x: cube.x,
            y: cube.y,
            z: cube.z,

            w: cube.cubeW, 
            h: cube.cubeH,
            d: cube.cubeD,

            color: cube.color, 
            name: cube.name,
        });
    });
    return savedCube;
}
// build a save data and tigger a json file download 
function downloadBaseDesignAsJson() { 
    saveCurrentLayerData(); 

    const designName = document.getElementById('designBaseName').textContent.trim(); // get name

    const savedLayers = floorLayers.map((layer, i) => { 
        let savedTiles, savedCubes; 

        if (i === currentLayerIndex) { 
            savedTiles = extractTilesFromBaseDesign(grid, window.CubeOnTheTile);
            savedCubes = readCubeDataFromBaseDesign(window.cubeRegistry);
        } else { //layers are stored as HTML string 
            const parser = new DOMParser(); //create a paser that can read html string as a document
            const parseDoc = parser.parseFromString('<div id = "root">' + layer.gridHTML + '</div>', 'text/html');
            savedTiles = extractTilesFromBaseDesign(parseDoc.getElementById('root'), layer.CubeOnTheTile);
            savedCubes = readCubeDataFromBaseDesign(layer.cubeRegistry);
        }

        return { name: layer.name, gridSize: layer.gridSize, tiles: savedTiles, cubes: savedCubes }; //return layer saved data
    });
    const NameForBase = document.getElementById("designBaseName");
    const saveData = {designName, layers: savedLayers, projectId:NameForBase.dataset.projectId}; // assmble the final save data object

    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = (designName || 'baseDesign') + '.json';
    downloadLink.click();

    console.log('Base design saved as JSON:', saveData);
}

window.downloadBaseDesignAsJson = downloadBaseDesignAsJson;

// Load design when input from Home.html
function rebuildLayerOnGrid(savedLayerData) {
    for (const [tileCoords, tileContent] of Object.entries(savedLayerData.tiles || {})) {
        const [x,y] = tileCoords.split(','); 
        const tile = document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
        if (!tile) continue;

        if (tileContent.floor) tile.style.backgroundColor = tileContent.floor;

        (tileContent.walls || []).forEach(wallInfo => { 
            placeWallTile(tile,wallInfo.color, wallInfo.direction, wallInfo.height, wallInfo.name);
        });
    }

    (savedLayerData.cubes || []).forEach(cubeInfo => {
        const tile = document.querySelector(`.tile[data-x="${cubeInfo.x}"][data-y="${cubeInfo.y}"]`);
        if (!tile) return;
        const itemObject = { 
            name: cubeInfo.name,
            color: cubeInfo.color, 
            x: cubeInfo.w, 
            y: cubeInfo.h, 
            z: cubeInfo.d, 
            name: cubeInfo.name,
            type: 'cube' 
        };
        placeItemOnTile(tile, itemObject, cubeInfo.z);
    });
}

//applies the save deising for builder and redirect to builder page
function applyDesignToBuilder(saveData) { 
    const nameEl = document.getElementById('designBaseName');
    nameEl.textContent = saveData.designName || "My Base";

    if (saveData.projectId) { 
        nameEl.dataset.projectId = saveData.projectId;
    }else {
        delete nameEl.dataset.projectId;
    }

    const activeLayerIndex = Math.min(saveData.currentLayerIndex || 0 , saveData.layers.length -1);

    const layerBuildOrder = saveData.layers.map((_,i) => i).filter(i => i !== activeLayerIndex); //build all layers except the active layer first, then build the active layer last
    layerBuildOrder.push(activeLayerIndex); 

    window.floorLayers = saveData.layers.map(savedLayer => ({ 
        name: savedLayer.name,
        gridSize: savedLayer.gridSize,
        gridHTML: '', // will be generated when the layer is activated
        CubeOnTheTile: new Map(),
        cubeRegistry: new Map(), 
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

        window.cubeRegistry.forEach((v,k) => freshLayer.cubeRegistry.set(k,v));
        window.CubeOnTheTile.forEach((v,k) => freshLayer.CubeOnTheTile.set(k,v));

        window.undoListItem.length = 0;
        window.redoListItem.length = 0;
    });

    window.currentLayerIndex = activeLayerIndex;
    loadLayerData(activeLayerIndex); 
    renderLayerList(); 

    console.log('Base design loaded into builder:', saveData);
}

function loadBaseDesignFromJson() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.addEventListener('change', () => { 
        const selectedFile = fileInput.files[0];
        if (!selectedFile) return;

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try { 
                const saveData = JSON.parse(e.target.result);
                if(!saveData || !saveData.layers) {
                    console.warn("invalid save file format ( must be json")
                    return; 
                }

                applyDesignToBuilder(saveData);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };
        fileReader.readAsText(selectedFile);
    });
    fileInput.click();
}

window.addEventListener('load', () => {
    const pending = localStorage.getItem('pendingBaseDesign');
    if (!pending) return; 

    localStorage.removeItem('pendingBaseDesign'); 

    try { 
        const saveData = JSON.parse(pending);
        if(!saveData || !saveData.layers) {
            console.warn("invalid save file format ( must be json");
                return; 
        }
            applyDesignToBuilder(saveData);
        } catch (error) {
            console.error("Error parsing pending base design JSON:", error);
        }
    
})
