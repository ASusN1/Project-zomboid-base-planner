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
    const userResult = await window.sb.auth.getUser();
    const user = userResult.data.user;
    const userError = userResult.error;
    console.log(userResult);

    
    if (userError || !user) { // if user not logged in
        alert("You must be logged in to save your design to the cloud.");
        return;
    }
    const saveData = await saveDesignToSupabase();

    const NameForBase = document.getElementById("designBaseName");
    let projectId = NameForBase.dataset.projectId;

    if (!projectId) { // if no projectId, create new design
        projectId = crypto.randomUUID(); // generate new projectId
        NameForBase.dataset.projectId = projectId; 
    }

    const screenshotBlob = await window.captureBaseDesingScreenShootForPreviewImgCard(); // capture screenshot of the design for preview image
    const previewPath = user.id + "/" + projectId + ".png"; // path to save the preview image in Supabase storage

    const uploadResult = await window.sb.storage
    .from('design-previews')
    .upload(previewPath, screenshotBlob, { upsert: true, contentType: 'image/png' });
    console.log("uploadResult:", uploadResult);

    const uploadError = uploadResult.error; // pull error from result

    if ( uploadError ) {
        alert("Error getting the image for preview: " + uploadError.message);
        return; 
    }

    const publicUrlResult = window.sb.storage
        .from('design-previews')
        .getPublicUrl(previewPath);

    const previewUrl = publicUrlResult.data.publicUrl; // get the public URL of the uploaded image

    const rowToSave= { 
        id: projectId,
        user_id: user.id,
        name: saveData.designName,
        design_data: saveData,
        preview_url: previewUrl
    };

    const upsetResult = await window.sb
        .from('designs')
        .upsert(rowToSave, { onConflict: 'id' });
    
    const data = upsetResult.data; // get retured data from result 
    const error = upsetResult.error; // pull error from result

    if (error) {
        alert("Error saving design to the cloud: " + error.message);
        return; 
    } 

    alert("Design saved to the cloud successfully!");
 }
window.saveDesignToSupabase = saveDesignToSupabase;
window.saveCurrentBaseDesignToSupabase = saveCurrentBaseDesignToSupabase;