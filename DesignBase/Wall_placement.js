const wall_tile_height_small = 60; // work on this first the other later 
const wall_tile_height_medium = 90; // work on this later
const wall_tile_height_large = 120; // work on this later

const wallHeights = {
    small: wall_tile_height_small,
    medium: wall_tile_height_medium,
    large: wall_tile_height_large
}
//Set the up the dericiton of the wall 
const direction_of_wall_tile = { 
    N : 'N',
    E : 'E',
    W : 'W',
    S : 'S'
}

const directionOrientationOrder = ['N', 'E', 'S', 'W']; 


//let currentWallDirection = direction_of_wall_tile.N; // default wall direction
let currentWallDirection = direction_of_wall_tile.N; // default wall direction

function createWallTile(color, direction_of_wall_tile,height) {
    const wall = document.createElement("div");
    wall.classList.add('wall-face', 'wall-direction-' + direction_of_wall_tile);
    wall.style.backgroundColor = color; 
    
    const px = (wallHeights[height] ?? wall_tile_height_small) + 'px';

    if (direction_of_wall_tile === 'E' || direction_of_wall_tile === 'W') {
        wall.style.width = px;
        wall.style.height = '100%';
    } else {
        wall.style.width = '100%';
        wall.style.height = px;
    }

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