//cloud save
async function saveDesignToSupabase() { 
    saveCurrentLayerData();

    const nameForBase = document.getElementById("designBaseName");
    let designName = nameForBase.textContent.trim(); 
    
    if (!designName) { // if name empty
        designName = "My Base"; 
        nameForBase.textContent = designName;
    }
    
    const savedLayers = [];

    for(let i = 0; i < floorLayers.length; i++) {
        const layer = floorLayers[i];
        let savedTiles, savedCubes; 

        if ( i === currentLayerIndex ) {
            savedTiles = extractTilesFromBaseDesign(grid, window.CubeOnTheTile);
            savedCubes = readCubeDataFromBaseDesign(window.cubeRegistry);
        }else { 
            const parser = new DOMParser(); 
            const parseDoc = parser.parseFromString('<div id="root">' + layer.gridHTML + '</div>', 'text/html') 

            savedTiles = extractTilesFromBaseDesign(parseDoc.getElementById('root'), layer.CubeOnTheTile);
            savedCubes = readCubeDataFromBaseDesign(layer.cubeRegistry);
        }

        //check if any tiles or cubes exist in the layer before saving
        const hasTiles = Object.keys(savedTiles).length >0;
        const hasCubes = savedCubes.length > 0; // 

        if (!hasTiles && !hasCubes) { 
            continue;
        }
        savedLayers.push({ name: layer.name, gridSize: layer.gridSize, tiles: savedTiles, cubes: savedCubes });
    }
    return { designName, layers: savedLayers, currentLayerIndex }; 
 };

 //upload/udpate current base design to sp 
 async function saveCurrentBaseDesignToSupabase() { 
    const storedToken = getStoredAccessToken();
    
    if (!storedToken) {
        alert("You must be logged in to save your base design to the cloud.");
        return;
    }
    const saveData = await saveDesignToSupabase();
    const NameForBase = document.getElementById("designBaseName");
    let projectId = NameForBase.dataset.projectId;

    if (!projectId) {
        projectId = crypto.randomUUID();
        NameForBase.dataset.projectId = projectId;
    }

    const rawScreenshotBlob = await window.captureBaseDesingScreenShootForPreviewImgCard();

    if(!rawScreenshotBlob) {
        alert("save process stopped, you myst allow screen sharing to capture the design preview image.");
        return;
    }

    const screenshotBlob = await window.compressImageForPreview(rawScreenshotBlob);

    const formData = new FormData();
    formData.append("previewImage", screenshotBlob, "preview.jpg");
    formData.append("designName", saveData.designName);
    formData.append("projectId", projectId);
    formData.append("designData", JSON.stringify(saveData));

    const saveResponse = await fetch(window.BACKEND_URL + "/designs/save", {
        method: "POST",
        headers: getAuthHeader(),
        body: formData
    });

    const saveResult = await saveResponse.json();

    if(!saveResponse.ok) {
        alert("Failed to save design: " + saveResult.error);
        return;
    }
    NameForBase.dataset.projectId  = saveResult.projectId;
    alert("Design saved successfully!");
 }
window.saveDesignToSupabase = saveDesignToSupabase;
window.saveCurrentBaseDesignToSupabase = saveCurrentBaseDesignToSupabase;