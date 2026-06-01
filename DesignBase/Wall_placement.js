const wall_tile_height_small = 60; // work on this first the other later 
const wall_tile_height_medium = 120; // work on this later
const wall_tile_height_large = 180; // work on this later

const wallHeights = {
    small: wall_tile_height_small,
    medium: wall_tile_height_medium,
    large: wall_tile_height_large
}
//Set the up the dericiton of the wall 
const direction_of_wall_tile = { 
    NS : 'NS', // top + bottom of the tile
    EW : 'EW' // left + right of the tile
}



let currentWallDirection = direction_of_wall_tile.NS; // default wall direction
//let currentWallDirection = direction_of_wall_tile.EW;

function createWallTile(color, direction_of_wall_tile,height) {
    const wall = document.createElement("div");

    wall.classList.add('wall-face', 'wall-direction-' + direction_of_wall_tile);
    
    wall.style.backgroundColor = color; 
    wall.style.height = (wallHeights[height] ?? wall_tile_height_small) + 'px'; // set height based on the wall's height property, default to small if not specified
    return wall;
}

// place/remove wall on tile
function placeWallTile(tile,color,direction_of_wall_tile, height) {
    const existingWall = tile.querySelector(".wall-direction-" + direction_of_wall_tile);

    if (existingWall) {
        existingWall.remove(); // remove the existing wall if it exists
        return;
    }

    const newWall = createWallTile(color, direction_of_wall_tile, height);
    tile.appendChild(newWall); // add the new wall to the tile
}

function prepareWallPlacement() {
    const allTiles = document.querySelectorAll('.tile'); // select all tiles

    allTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (currentToolusing != 'place') return; // only place wall if the current tool is 'place'
            if (!selectedItem) return; // ensure an item is selected before placing a wall
            if (selectedItem.type !== 'wall') return; // only place wall if the selected item is a wall

            placeWallTile(tile, selectedItem.color, currentWallDirection, selectedItem.height); // place the wall on the clicked tile
        });
    });
}

prepareWallPlacement(); 