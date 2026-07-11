// return the sprite path for a given name + face
function getCubeSpritePath(itemName, face) { 
    const entry = window.CubeSpriteData && window.CubeSpriteData[itemName];

    if (!entry) {
        return null;
    }

    return entry[face] || null;
}
window.getCubeSpritePath = getCubeSpritePath; 