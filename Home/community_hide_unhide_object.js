window.viewerHideMode = "cube";

window.viewerHiddenCubeIndexes = [];
window.viewerHiddenWallElements = [];

function resetViewerHiddenTracking() {
    window.viewerHiddenCubeIndexes = [];
    window.viewerHiddenWallElements = [];
}
window.resetViewerHiddenTracking = resetViewerHiddenTracking;

function handleViewerTileHideClick(tile){
    if (window.viewerHideMode === "cube") {
        const cubesOnTile = [];
        
        for (let i = 0; i< window.viewerCubeRegistry.length; i++) {
            const cubeData  = window.viewerCubeRegistry[i];
            if (cubeData.tiles.includes(tile)) {
                cubesOnTile.push({index: i, data: cubeData});
            }
        }
        //the highest z get hidden first
        cubesOnTile.sort((a,b)=> b.data.z - a.data.z);
        let cubeToHide = null;
        for(let i = 0; i< cubesOnTile.length; i++) {
            if(!window.viewerHiddenCubeIndexes.includes(cubesOnTile[i].index)) {
                cubeToHide = cubesOnTile[i];
                break;
            }
        }//if found a visible cubes, hide it 
        if(cubeToHide) {
            for(let i = 0; i <cubeToHide.data.elements.length; i++) {
                cubeToHide.data.elements[i].style.display = "none";
            }
            window.viewerHiddenCubeIndexes.push(cubeToHide.index);
        }
        return;
    }

    if (window.viewerHideMode === "wall") {
        const wallElementsOnTile = tile.querySelectorAll(".wall-face");

        for(let i = 0; i < wallElementsOnTile.length; i++) {
            const wallEl = wallElementsOnTile[i];

            if(wallEl.style.display === "none") {
                continue; //already hidden
            }
            wallEl.style.display = "none";
            window.viewerHiddenWallElements.push(wallEl);
        }
    }
}
window.handleViewerTileHideClick = handleViewerTileHideClick;

function unhideAllInViewer() {
    for (let i = 0; i < window.viewerHiddenCubeIndexes.length; i++) {
        const index = window.viewerHiddenCubeIndexes[i];
        const cubeData = window.viewerCubeRegistry[index];
        if (!cubeData) continue;

        for (let j = 0; j < cubeData.elements.length; j++) {
            cubeData.elements[j].style.display = "";
        }
    }
    window.viewerHiddenCubeIndexes = [];

    for (let i = 0; i < window.viewerHiddenWallElements.length; i++) {
        window.viewerHiddenWallElements[i].style.display = "";
    }
    window.viewerHiddenWallElements = [];
}
window.unhideAllInViewer = unhideAllInViewer;