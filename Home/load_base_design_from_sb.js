const cardRowContainer = document.querySelector('.card-row'); 

// description: time project updated 
function timeProjectUpdated(timestampString) {
    const updatedData = new Date(timestampString);
    const secondsAgo = Math.floor((Date.now() - updatedData.getTime()) / 1000);
    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo} minutes ago`;
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo} hours ago`;
    } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo} days ago`;
    }
}

function buildCardFromDesignData(designRow, isAlreadyShared) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card-design';
    
    cardEl.dataset.designId = designRow.id; 

    const previewEl = document.createElement('div');
    previewEl.className = 'card-preview-picture';

    if (designRow.preview_url) { // only addd preview if the image url exists
        const previewImg = document.createElement('img');
        previewImg.src = designRow.preview_url;
        previewImg.alt = "Design preview";
        previewEl.appendChild(previewImg);
    } 

    const infoEl = document.createElement('div');
    infoEl.className = 'card-info-area';

    const nameEl = document.createElement('h3');
    nameEl.className = 'info-label';
    nameEl.textContent = "Name: " + (designRow.name || "My Base");

    const updatedEl = document.createElement('p');
    updatedEl.className = 'info-label';
    updatedEl.textContent = designRow.updated_at ? timeProjectUpdated(designRow.updated_at) : "No update time available";

    const shareBtn = document.createElement('button');
    shareBtn.className = 'top-bar-btn';

    // if design already has a public version, change text to "stop sharing" other wise share
    if(isAlreadyShared) {
        shareBtn.textContent = "Stop Sharing";
    } else {
        shareBtn.textContent = "Share to Community";
    }
    shareBtn.addEventListener("click",async (e) => {
        e.stopPropagation(); // prevent card click event

        if (shareBtn.textContent ==="Share To Community") {
            await shareDesignToCommunity(designRow.id); 
            shareBtn.textContent = "Stop Sharing";
        }else {
            await unshareDesignFromCommunity(designRow.id); 
            shareBtn.textContent = "Share To Community";
        }
    });

    infoEl.appendChild(nameEl);
    infoEl.appendChild(updatedEl);
    infoEl.appendChild(shareBtn);

    cardEl.appendChild(previewEl);
    cardEl.appendChild(infoEl);

    cardEl.addEventListener('click', () => {
        if (window.isDeleteSelectMode) {
            return; // if in delete select mode, base buidler wont be open 
        }
        const designDataWithId = { ...designRow.design_data, projectId: designRow.id };
        localStorage.setItem("pendingBaseDesign", JSON.stringify(designDataWithId));
        window.location.href = '../DesignBase/index.html';
    });
    return cardEl; 
}

async function loadBaseDesignsFromSupabase() {
    const storedToken = getStoredAccessToken(); // check if logged in

    if (!storedToken) {
        console.log("User not authenticated. Please log in.");
        return;
    }

    const listResponse = await fetch(window.BACKEND_URL + "/designs/List", {
        headers: getAuthHeader(), // attach the bearer token
    });

    const listResult = await listResponse.json(); // { designs, sharedDesignIds }

    if (!listResponse.ok) {
        console.error("Error fetching base designs: " + listResult.error);
        return;
    }

    const shareDesignIds = new Set(listResult.sharedDesignIds); // quick lookup of which designs are already shared

    cardRowContainer.querySelectorAll(".card-design.cloud-card").forEach(el => el.remove()); // clear old cards

    const addNewCardEl = document.getElementById("addNewCardButton");

    listResult.designs.forEach(designRow => {
        const isAlreadyShared = shareDesignIds.has(designRow.id);
        const cardEl = buildCardFromDesignData(designRow, isAlreadyShared);
        cardEl.classList.add("cloud-card");
        cardRowContainer.insertBefore(cardEl, addNewCardEl);
    });

    console.log("Base designs loaded successfully.");
}
window.addEventListener("load", loadBaseDesignsFromSupabase);