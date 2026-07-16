const communityCardRowContainer = document.getElementById("communityCardRow");

function buildCommunityDesignCard(designData, author_user_name) {
    const cardEl = document.createElement("div");

    cardEl.className = " card-design"; // reuse the card style
    cardEl.dataset.designId = designRow.id;

    const previewEl = document.createElement("div");
    previewEl.className = "card-preview-picture";

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
        const designDataWithId = {...designRow.design_data};
        delete designDataWithId.projectId; 
        localStorage.setItem("selectedDesignData", JSON.stringify(designDataWithId));
        window.location.href = "../DesignBase/DesignBase.html";
    });
    return cardEl; 
}

async function loadCOmmunityDesignsFromSupabase() {
    //get the public desing + author name 
    const queryResult = await window.sb
        .from("designs")
        .select("id, name, design_data, user_id, profiles(user_name)")
        .eq("is_public", true) // only community designs
        .order("update_at", { ascending: false }); // newest first 
    
    const rows= queryResult.data;
    const error = queryResult.error;

    if (error) {
        console.error("Error loading community designs:", error);
        return; 
    }

    communityCardRowContainer.innerHTML = ""; // clear previous content

    for(let i = 0 ; i< rows.length; i++) {
        const designRow = rows[i];
        const author_user_name = designRow.profiles && desigRow.profiles.user_name;
        const cardEl = buildCommunityDesignCard(designRow, author_user_name);
        communityCardRowContainer.appendChild(cardEl);
    }
}

window.loadCOmmunityDesignsFromSupabase = loadCOmmunityDesignsFromSupabase;