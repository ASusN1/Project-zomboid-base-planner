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
        showCommunityDesignPreview(designRow, author_user_name);
    });
    return cardEl; 
}

async function loadCOmmunityDesignsFromSupabase() {
    //get the public desing + author name 
    const queryResult = await window.sb
        .from("designs")
        .select("id, name, design_data,preview_url, user_id, profiles(username)")
        .eq("is_public", true) // only community designs
        .order("updated_at", { ascending: false }); // newest first 
    
    const rows= queryResult.data;
    const error = queryResult.error;

    if (error) {
        console.error("Error loading community designs:", error);
        return; 
    }

    communityCardRowContainer.innerHTML = ""; // clear previous content

    for(let i = 0 ; i< rows.length; i++) {
        const designRow = rows[i];
        const author_user_name = designRow.profiles && designRow.profiles.username;
        const cardEl = buildCommunityDesignCard(designRow, author_user_name);
        communityCardRowContainer.appendChild(cardEl);
    }
}

window.loadCOmmunityDesignsFromSupabase = loadCOmmunityDesignsFromSupabase;