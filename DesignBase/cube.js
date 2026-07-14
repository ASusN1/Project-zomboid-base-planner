if (!window.cubeRegistry) {
    window.cubeRegistry = new Map(); // key: "x,y,z" -> value: cubeData
}

if (!window.CubeOnTheTile) {
    window.CubeOnTheTile = new Map(); // key: "x,y,z" -> value: cubeKey
}

const TILESIZE = 58;

//Get the color of the cube then then change it to color for other 6 faces ( This just for testin, later remove then 
// actually use the png)
function shadeColor(hex, amount) {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

function applyCubeSprite(el, itemName, face, fallbackColor) {
    const spritePath = window.getCubeSpritePath? window.getCubeSpritePath(itemName, face) : null;
    if(!spritePath) {
        el.style.background = fallbackColor; // no sprite --> use color
        return; 
    }

    el.style.backgroundImage = `url(${spritePath})`;
    el.style.backgroundSize = 'cover';

    const img = new Image();

    img.onerror = () => {
        el.style.background = fallbackColor;
        el.style.backgroundImage = ""; 
    };
    img.src = spritePath;
}

function placeCubeOnGrid(anchorTile, item, baseZ = 0 ) {
    // get the psotion of the cube ( like the grid thingy) 
    const ax = parseInt(anchorTile.dataset.x); 
    const ay = parseInt(anchorTile.dataset.y); 
    const az = baseZ;

    if (cubeCollisionCheck(anchorTile, item, baseZ)) return;

    // get the cube size from itemdatabase.js 
    const CubeWidthX = item.X ?? item.x ?? 1; // 
    const CubeHeightY = item.Y ?? item.y ?? 1; // 
    const CubeDepthZ = item.Z ?? item.z ?? 1; // 

    const color = item.color || item.colorN || '#C8A87A'; // base colour fallback
    const wallH = CubeDepthZ * TILESIZE;
    const baseOffsetpx = az * TILESIZE; // how much to lift the cube above the tile surface based on its Z level
    const key = `${ax},${ay},${az}`;

    if (window.cubeRegistry.has(key)) return; // don't place two cubes at same anchor

    // for now just use EW and NS side since if added both 4 wall cannot see clearly 
    const colorTop   = shadeColor(color, +55); 
    const colorNS    = color;                  
    const colorEW    = shadeColor(color, -55); 
    const colorFloor = shadeColor(color, -30); 

    const elements = []; 
    const ownedTiles = [];

    // create 4 side wall, then the top and bottom of the cube ( later rember to change to png or smt)
    const prevFloorColors = new Map(); // to store previous floor colors for undo
    for (let dx = 0; dx < CubeWidthX; dx++) {
        for (let dy = 0; dy < CubeHeightY; dy++) {
            const t = getTileAt(ax + dx, ay + dy);
            if (!t) continue;

        // only paint color if first cube, the above cube wont change color
            if (az === 0) { 
                prevFloorColors.set(t, t.style.backgroundColor);
                applyCubeSprite(t, item.name, 'bottom', colorFloor);
            }

            // Top cap lifted by wallH so it appears above tile surface
            const top = document.createElement('div');
            top.className = 'cube-top';
            top.style.cssText = `width:${TILESIZE}px;height:${TILESIZE}px;transform:translateZ(${wallH+ baseOffsetpx}px);`;
            applyCubeSprite(top, item.name, 'top', colorTop);
            
            // the bottom cube's top will act like a grid place cube on top 
            top.dataset.x = ax + dx; 
            top.dataset.y = ay + dy; 
            top.dataset.z = az + CubeDepthZ;
            top.classList.add('cube-stack-target');
            top.textContent = `${top.dataset.x},${top.dataset.y}, ${top.dataset.z}`; // for debugging, shows coordinates on top face
            
            top.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent tile click
                if ( window.currentToolusing === 'place' && window.selectedItem && window.selectedItem.type ==='cube') {
                    const stackHeight = parseInt(top.dataset.z, 10);
                    placeCubeOnTopOfEachOther(top,window.selectedItem, stackHeight);
                }
            });

            t.appendChild(top);
            elements.push({ el: top, parent: t });

            // NS walls: front face when dx === 0, back face when dx === CubeWidthX-1
            if (dx === 0 || dx === CubeWidthX - 1) {
                const ns = document.createElement('div');
                ns.className = 'cube-face-ns';
                ns.style.cssText = `--baseZ:${baseOffsetpx}px;height:${wallH}px;`;
                applyCubeSprite(ns, item.name, 'S', colorNS);
                t.appendChild(ns);
                elements.push({ el: ns, parent: t });
            }

            // EW walls: front face when dy === 0, back face when dy === CubeHeightY-1
            if (dy === 0 || dy === CubeHeightY - 1) {
                const ew = document.createElement('div');
                ew.className = 'cube-face-ew';
                ew.style.cssText = `--baseZ:${baseOffsetpx}px;width: ${wallH}px;height:${TILESIZE}px;`;
                applyCubeSprite(ew, item.name, 'E', colorEW);
                t.appendChild(ew);
                elements.push({ el: ew, parent: t });
            }

            window.CubeOnTheTile.set(`${ax + dx},${ay + dy}, ${az}`, key);
            ownedTiles.push(t);
        }
    }

    // Put a lightweight marker on the anchor tile so simple delete code can spot a cube
    const anchorMarker = document.createElement('div');
    anchorMarker.className = 'cube-object';
    anchorMarker.style.cssText = 'position:absolute;pointer-events:none;left:0;top:0;width:1px;height:1px;';
    anchorMarker.dataset.z = az; // store z level for stack placement
    (ownedTiles[0] || anchorTile).appendChild(anchorMarker);
    elements.push({ el: anchorMarker, parent: anchorTile });

    // Register the placed cube so it can be removed as a unit later
    const cubeData ={
        x: ax,
        y: ay,
        z: az,
        cubeH: CubeHeightY,
        cubeD: CubeDepthZ,
        cubeW: CubeWidthX,
        color,
        name: item.name,
        elements,
        tiles: ownedTiles,
        key
    };
    window.cubeRegistry.set (key, cubeData);

    window.undoListItem.push({ 
        undo() {
            cubeData.elements.forEach(({el}) => el.remove());
            cubeData.tiles.forEach(t => {
                if (az ===0 ) {
                    t.style.backgroundColor = prevFloorColors.get(t) ?? ''
                }
                window.CubeOnTheTile.delete(`${t.dataset.x},${t.dataset.y}, ${az}`);
            });
            window.cubeRegistry.delete(key);
        },
        redo() { 
            placeCubeOnGrid(anchorTile, item,baseZ);
        }
    });
    window.redoListItem = [];
}

function placeCubeOnTopOfEachOther(anchorTile, item, height) {
    const CubeDepthZ = item.Z ?? item.z ?? 1; 

    if ( height + CubeDepthZ > 3) { 
        console.warn('Cannot place cube: exceeds maximum height limit');
        return;
    }
    placeCubeOnGrid(anchorTile, item, height);
}

function getTopCubeAt(tile) {
    let top = null; 
    for (const cube of window.cubeRegistry.values()) {
        if (cube.tiles.includes(tile) && (!top || cube.z > top.z)) {
            top = cube;
        }
    } 
    return top; 
}
window.getTopCubeAt = getTopCubeAt;

function getTileAt(x, y) {
    // prefer dataset if present
    const byData = document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
    if (byData) return byData;
    // fallback: scan tiles and compare textContent
    const tiles = document.querySelectorAll('.tile');
    for (const t of tiles) {
        if ((t.dataset.x === String(x) && t.dataset.y === String(y)) || t.textContent.trim() === `${x},${y}`) return t;
    }
    return null;
}

// Prevent cube placing within each other 
const cubeCollisionCheck = (anchorTile, item, az= 0 ) => {
    let collision = false;
    const ax = parseInt(anchorTile.dataset.x);
    const ay = parseInt(anchorTile.dataset.y);

    const CubeWidthX = item.X ?? item.x ?? 1;
    const CubeHeightY = item.Y ?? item.y ?? 1;

    for (let dx = 0; dx < CubeWidthX; dx++) {
        for (let dy = 0; dy < CubeHeightY; dy++) {
            if (CubeOnTheTile.has(`${ax + dx},${ay + dy}, ${az}`)) {
                console.log('Collision detected at', ax + dx, ay + dy, az, 'for cube at', ax, ay, az);
                return collision = true;
            }
        }
    }
    console.log('No collision detected for cube at', ax, ay, az);
    return collision = false;
}

window.cubeRegistry = window.cubeRegistry || new Map();
window.tileOwner = window.CubeOnTheTile || new Map();
window.CubeOnTheTile = window.CubeOnTheTile || new Map();
