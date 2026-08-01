function getFloorSpritePath(name){
    const list = window.floor_sprite_data;
    if(!list) {
        return null;
    }
    
    const entry = list.find(item=> item.name === name);

    if(!entry) {
        return null;
    }
    return entry.Floor_sprite || null;
}

window.getFloorSpritePath = getFloorSpritePath;