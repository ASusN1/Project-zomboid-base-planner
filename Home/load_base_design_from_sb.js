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

function buildCardFromDesignData(designRow) {
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

    infoEl.appendChild(nameEl);
    infoEl.appendChild(updatedEl);

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
    const userResult = await window.sb.auth.getUser();

    const user = userResult.data.user;
    if (!user) { 
        console.error("User not authenticated. Please log in.");
        return;

    } 
    const queryResult = await window.sb
    .from('designs')
    .select("id, name, updated_at, design_data, preview_url")

    .eq('user_id', user.id) // only pull the base designs for the current user
    .order("updated_at", { ascending: false }); // order by most recently updated first

    const row = queryResult.data;
    const error = queryResult.error;

    if (error) {
        console.error("Error fetching base designs from Supabase:", error.message);
        return;
    }

    cardRowContainer.querySelectorAll('.card-design.cloud-card').forEach(el => el.remove()); // clear old cloud cards 

    const addNewCardEl = document.getElementById("addNewCardButton") ; 

    row.forEach(designRow => { 
        const cardEl = buildCardFromDesignData(designRow);
        cardEl.classList.add('cloud-card');
         cardRowContainer.insertBefore(cardEl, addNewCardEl);
    });
    console.log("Base designs loaded successfully from Supabase.");
}
window.addEventListener("load", loadBaseDesignsFromSupabase);