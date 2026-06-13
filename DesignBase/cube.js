
const cubeRegistry = new Map();
const CubeOnTheTile = new Map();

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

function placeCubeOnGrid(anchorTile, item) {
    // get the psotion of the cube ( like the grid thingy) 
    const ax = parseInt(anchorTile.dataset.x); 
    const ay = parseInt(anchorTile.dataset.y); 
    const az = 0;

    // get the cube size from itemdatabase.js 
    const CubeWidthX = item.X ?? item.x ?? 1; // 
    const CubeHeightY = item.Y ?? item.y ?? 1; // 
    const CubeDepthZ = item.Z ?? item.z ?? 1; // 

    const color = item.color || item.colorN || '#C8A87A'; // base colour fallback
    const wallH = CubeDepthZ * TILESIZE; 
    const key = `${ax},${ay},${az}`;

    if (cubeRegistry.has(key)) return; // don't place two cubes at same anchor

    // for now just use EW and NS side since if added both 4 wall cannot see clearly 
    const colorTop   = shadeColor(color, +55); 
    const colorNS    = color;                  
    const colorEW    = shadeColor(color, -55); 
    const colorFloor = shadeColor(color, -30); 

    const elements = []; 
    const ownedTiles = [];

    // create 4 side wall, then the top and bottom of the cube ( later rember to change to png or smt)
    for (let dx = 0; dx < CubeWidthX; dx++) {
        for (let dy = 0; dy < CubeHeightY; dy++) {
            const t = getTileAt(ax + dx, ay + dy);
            if (!t) continue;

            // Record previous colour for undo stack, then tint the floor
            const prevBg = t.style.backgroundColor;
            t.style.backgroundColor = colorFloor;
            if (window.undoListItem) window.undoListItem.push({ tile: t, previousColor: prevBg, newColor: colorFloor });

            // Top cap lifted by wallH so it appears above tile surface
            const top = document.createElement('div');
            top.className = 'cube-top';
            top.style.cssText = `width:${TILESIZE}px;height:${TILESIZE}px;background:${colorTop};transform:translateZ(${wallH}px);`;
            t.appendChild(top);
            elements.push({ el: top, parent: t });

            // NS walls: front face when dx === 0, back face when dx === CubeWidthX-1
            if (dx === 0 || dx === CubeWidthX - 1) {
                const ns = document.createElement('div');
                ns.className = 'cube-face-ns';
                ns.style.cssText = `background:${colorNS};height:${wallH}px;`;
                t.appendChild(ns);
                elements.push({ el: ns, parent: t });
            }

            // EW walls: front face when dy === 0, back face when dy === CubeHeightY-1
            if (dy === 0 || dy === CubeHeightY - 1) {
                const ew = document.createElement('div');
                ew.className = 'cube-face-ew';
                ew.style.cssText = `background:${colorEW};width: ${wallH}px;height:${TILESIZE}px;`;
                t.appendChild(ew);
                elements.push({ el: ew, parent: t });
            }

            CubeOnTheTile.set(`${ax + dx},${ay + dy}`, key);
            ownedTiles.push(t);
        }
    }

    // Put a lightweight marker on the anchor tile so simple delete code can spot a cube
    const anchorMarker = document.createElement('div');
    anchorMarker.className = 'cube-object';
    anchorMarker.style.cssText = 'position:absolute;pointer-events:none;left:0;top:0;width:1px;height:1px;';
    anchorTile.appendChild(anchorMarker);
    elements.push({ el: anchorMarker, parent: anchorTile });

    // Register the placed cube so it can be removed as a unit later
    cubeRegistry.set(key, {
        x: ax,
        y: ay,
        z: az,
        cubeH: CubeHeightY,
        cubeD: CubeDepthZ,
        cubeZ: CubeWidthX,
        color,
        elements,
        tiles: ownedTiles
    });

    // Clear redo stack if present
    if (window.redoListItem) window.redoListItem = [];
}
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

window.cubeRegistry = cubeRegistry;
window.tileOwner = CubeOnTheTile;
window.CubeOnTheTile = CubeOnTheTile;
