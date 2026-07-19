const communityViewerContainer = document.querySelector(".design-community-preview-content-main");
const communityViewerGrid = document.getElementById("communityDesignViewerGrid");

let communityViewerZoom = 1;
let communityViewerOffsetX = 0;
let communityViewerOffsetY = 0;
let communityViewerIsDragging = false;
let communityViewerStartX = 0;
let communityViewerStartY = 0;

function updateCommunityViewerTransform() {
    communityViewerGrid.style.transform =
        `translate(${communityViewerOffsetX}px, ${communityViewerOffsetY}px) rotateX(60deg) rotateZ(45deg) scale3d(${communityViewerZoom}, ${communityViewerZoom}, ${communityViewerZoom})`;
}

communityViewerContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) { 
        communityViewerZoom += 0.1;
    } else { 
        communityViewerZoom -= 0.1;
    }
    communityViewerZoom = Math.max(0.1, Math.min(communityViewerZoom, 2));
    updateCommunityViewerTransform();
});


communityViewerContainer.addEventListener("mousedown", (e) => {
    communityViewerIsDragging = true; 
    communityViewerStartX = e.clientX; 
    communityViewerStartY = e.clientY; 
    communityViewerContainer.style.cursor = "grabbing"; 
});


document.addEventListener("mouseup", () => {
    if (communityViewerIsDragging) { 
        communityViewerIsDragging = false; 
        communityViewerContainer.style.cursor = "default"; 
    }
});


document.addEventListener("mousemove", (e) => {
    if (!communityViewerIsDragging) return;

    const dx = e.clientX - communityViewerStartX; 
    const dy = e.clientY - communityViewerStartY; 

    communityViewerOffsetX += dx; 
    communityViewerOffsetY += dy;

    communityViewerStartX = e.clientX; 
    communityViewerStartY = e.clientY;

    updateCommunityViewerTransform(); // 
});


communityViewerContainer.addEventListener("mouseleave", () => {
    if (communityViewerIsDragging) { 
        communityViewerIsDragging = false; 
        communityViewerContainer.style.cursor = "default"; 
    }
});