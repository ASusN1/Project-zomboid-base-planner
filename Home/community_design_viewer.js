window.communityViewerLayers = [];
window.communityViewerCurrentIndex = 0;

const VIEWER_TILESIZE = 58;

function viewerShadeColor(hex, amount) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function buildViewerGrid(gridSize) {
    const gridEl = document.getElementById("communityDesignViewerGrid");
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const tile = document.createElement("div");
            tile.className = "community-viewer-tile";
            tile.dataset.x = x;
            tile.dataset.y = y;
            gridEl.appendChild(tile);
        }
    }
}

function getViewerTileAt(x, y) {
    return document.querySelector(`.community-viewer-tile[data-x="${x}"][data-y="${y}"]`);
}

function rebuildViewerLayer(savedLayerData) {
    buildViewerGrid(savedLayerData.gridSize);

    for (const [tileCoords, tileContent] of Object.entries(savedLayerData.tiles || {})) {
        const [x, y] = tileCoords.split(",");
        const tile = getViewerTileAt(x, y);
        if (!tile) continue;

        if (tileContent.floor) {
            tile.style.backgroundImage = "none";
            tile.style.backgroundColor = tileContent.floor;
        }

        (tileContent.walls || []).forEach(wallInfo => {
            const wall = document.createElement("div");
            wall.className = "wall-face wall-direction-" + wallInfo.direction;
            wall.style.backgroundColor = wallInfo.color;

            const spritePath = window.getWallSpritePath ? window.getWallSpritePath(wallInfo.height, wallInfo.name, wallInfo.direction) : null;
            if (spritePath) {
                wall.style.backgroundImage = `url(${spritePath})`;
                wall.style.backgroundSize = "cover";
            }

            const wallHeights = { small: 60, medium: 90, large: 120 };
            const px = (wallHeights[wallInfo.height] ?? 60) + "px";

            if (wallInfo.direction === "E" || wallInfo.direction === "W") {
                wall.style.width = px;
                wall.style.height = "100%";
            } else {
                wall.style.width = "100%";
                wall.style.height = px;
            }
            tile.appendChild(wall);
        });
    }

    (savedLayerData.cubes || []).forEach(cubeInfo => {
        const anchorTile = getViewerTileAt(cubeInfo.x, cubeInfo.y);
        if (!anchorTile) return;

        const wallH = cubeInfo.d * VIEWER_TILESIZE;
        const baseOffsetpx = cubeInfo.z * VIEWER_TILESIZE;

        const colorTop = viewerShadeColor(cubeInfo.color, 55);
        const colorNS = cubeInfo.color;
        const colorEW = viewerShadeColor(cubeInfo.color, -55);

        for (let dx = 0; dx < cubeInfo.w; dx++) {
            for (let dy = 0; dy < cubeInfo.h; dy++) {
                const t = getViewerTileAt(cubeInfo.x + dx, cubeInfo.y + dy);
                if (!t) continue;

                if (cubeInfo.z ===0 ) {
                    let bottomSprite = null;

                    if(window.getCubeSpritePath){
                        bottomSprite = window.getCubeSpritePath(cubeInfo.name, "bottom");
                    }
                    if (bottomSprite) { // sprite found , use sprite image
                        t.style.backgroundImage = `url(${bottomSprite})`;
                        t.style.backgroundSize = "cover";
                    } else { //srpite not found , use color 
                        t.style.backgroundImage = "none";
                        t.style.backgroundColor = viewerShadeColor(cubeInfo.color, -30);
                    }
                }

                const top = document.createElement("div");
                top.className = "cube-top";
                top.style.cssText = `width:${VIEWER_TILESIZE}px;height:${VIEWER_TILESIZE}px;transform:translateZ(${wallH + baseOffsetpx}px);`;
                const topSprite = window.getCubeSpritePath ? window.getCubeSpritePath(cubeInfo.name, "top") : null;

                if (topSprite) {
                    top.style.backgroundImage = `url(${topSprite})`;
                    top.style.backgroundSize = "cover";
                } else {
                    top.style.backgroundColor = colorTop;
                }
                t.appendChild(top);

                if (dx === 0 || dx === cubeInfo.w - 1) {
                    const ns = document.createElement("div");
                    ns.className = "cube-face-ns";
                    ns.style.cssText = `--baseZ:${baseOffsetpx}px;height:${wallH}px;`;

                    const nsSprite = window.getCubeSpritePath ? window.getCubeSpritePath(cubeInfo.name, "S") : null;
                    if (nsSprite) {
                        ns.style.backgroundImage = `url(${nsSprite})`;
                        ns.style.backgroundSize = "cover";
                    } else {
                        ns.style.background = colorNS;
                    }
                    t.appendChild(ns);
                }

                if (dy === 0 || dy === cubeInfo.h - 1) {
                    const ew = document.createElement("div");
                    ew.className = "cube-face-ew";
                    ew.style.cssText = `--baseZ:${baseOffsetpx}px;width:${wallH}px;height:${VIEWER_TILESIZE}px;`;
                    const ewSprite = window.getCubeSpritePath ? window.getCubeSpritePath(cubeInfo.name, "E") : null;
                    if (ewSprite) {
                        ew.style.backgroundImage = `url(${ewSprite})`;
                        ew.style.backgroundSize = "cover";
                    } else {
                        ew.style.background = colorEW;
                    }
                    t.appendChild(ew);
                }
            }
        }
    });
}

function renderViewerLayerList() {
    const listEl = document.getElementById("communityViewerLayerList");
    listEl.innerHTML = "";

    for (let i = window.communityViewerLayers.length - 1; i >= 0; i--) {
        const item = document.createElement("div");
        item.className = "community-viewer-layer-item";
        if (i === window.communityViewerCurrentIndex) item.classList.add("active");
        item.textContent = window.communityViewerLayers[i].name;

        item.addEventListener("click", () => {
            window.communityViewerCurrentIndex = i;
            rebuildViewerLayer(window.communityViewerLayers[i]);
            renderViewerLayerList();
        });
        listEl.appendChild(item);
    }
}

function renderCommunityDesignViewer(designData) {
    window.communityViewerLayers = designData.layers || [];
    window.communityViewerCurrentIndex = Math.min(designData.currentLayerIndex || 0, window.communityViewerLayers.length - 1);

    if (window.communityViewerLayers.length === 0) return;

    rebuildViewerLayer(window.communityViewerLayers[window.communityViewerCurrentIndex]);
    renderViewerLayerList();
}

window.renderCommunityDesignViewer = renderCommunityDesignViewer;