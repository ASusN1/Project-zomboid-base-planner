window.Wall_data_with_sprite= { 
    small: small_wall_sprite_data,
    medium: medium_wall_sprite_data,
    large: large_wall_sprite_data
};

//look up sprite path by height + item name+ direction 
function getWallSpritePath(height, name, direction) { 
    const list = window.Wall_data_with_sprite[height];

    if (!list) return null; 

    const entry = list.find(item => item.name === name) ; 
    if (!entry) return null;

    return entry.Wall_sprite[direction] || null;
}

window.getWallSpritePath = getWallSpritePath;