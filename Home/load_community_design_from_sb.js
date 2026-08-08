const communityCardRowContainer = document.getElementById("communityCardRow");

function buildCommunityDesignCard(designRow, author_user_name) {
    const cardEl = document.createElement("div");

    cardEl.className = " card-design"; // reuse the card style
    cardEl.dataset.designId = designRow.id;

    const previewEl = document.createElement("div");
    previewEl.className = "card-preview-picture";

    if (designRow.preview_url){
        const previewImg = document.createElement("img");
        previewImg.src = designRow.preview_url;
        previewImg.alt = "Preview Image";
        previewEl.appendChild(previewImg);
    }

    const infoEl = document.createElement("div");
    infoEl.className = "card-info-area";

    const nameEl = document.createElement("h3");
    nameEl.className = "info-label";
    nameEl.textContent = "Name" + (designRow.name || "My Base");

    const authorEl = document.createElement("p");
    authorEl.className = "info-label";
    authorEl.textContent = "author: " + (author_user_name || "unknown"); 

    infoEl.appendChild(nameEl);
    infoEl.appendChild(authorEl);

    cardEl.appendChild(previewEl);
    cardEl.appendChild(infoEl);

    cardEl.addEventListener("click", () => {
        openCommunityDesignPreview(designRow, author_user_name);
    });
    return cardEl; 
}

async function loadCOmmunityDesignsFromSupabase() {
    const listResponse = await fetch(window.BACKEND_URL + "/community/list");
    const listResult = await listResponse.json();

    if(!listResponse.ok) {
        console.error("Error loading community designs: " + listResult.error);
        return;
    }

    communityCardRowContainer.innerHTML = "";
    
    for (let i = 0; i < listResult.designs.length; i++) {
        const designRow = listResult.designs[i];
        const author_user_name =  designRow.profiles && designRow.profiles.username;
        const cardEl = buildCommunityDesignCard(designRow, author_user_name);
        communityCardRowContainer.appendChild(cardEl);
    }
}

window.loadCOmmunityDesignsFromSupabase = loadCOmmunityDesignsFromSupabase;