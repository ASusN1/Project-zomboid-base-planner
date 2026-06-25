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
                    height: heightOfObject[heightINPixels] || 'small'
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
    const saveData = {designName, layers: savedLayers}; // assmble the final save data object

    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = (designName || 'baseDesign') + '.json';
    downloadLink.click();

    console.log('Base design saved as JSON:', saveData);
}

window.downloadBaseDesignAsJson = downloadBaseDesignAsJson;