function handleViewerTileHideClick(tile){
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
    }

    //if found a visible cubes, hide it 
    if(cubeToHide) {
        for(let i = 0; i <cubeToHide.data.elements.length; i++) {
            cubeToHide.data.elements[i].style.display = "none";
        }
        window.viewerHiddenCubeIndexes.push(cubeToHide.index);
        return;
    }

    //no cube to hide --> hide wall instead
    const wallElementsOnTile = tile.querySelectorAll(".wall-face");

    for (let i = 0; i < wallElementsOnTile.length; i++) {
        const wallEl = wallElementsOnTile[i];

        if(wallEl.style.display === "none") {
            continue; //already hidden
        }
        wallEl.style.display = "none";
        window.viewerHiddenWallElements.push(wallEl);
    }
}

window.handleViewerTileHideClick = handleViewerTileHideClick;