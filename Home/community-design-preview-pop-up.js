function openCommunityDesignPreview(designRow, author_user_name) {
    const previewBox = document.getElementById("designPreviewForCommunity");
    const previewMain = document.querySelector(".design-community-preview-content-main"); // for now keep blank cuz later update to custome version of base design

    const titleEl = document.getElementById("designPreviewName");
    const authorEl = document.getElementById("designPreviewAuthor");
    const copyBtn = document.getElementById("copyDesignBtn");

    previewMain.innerHTML = "";
    if (designRow.preview_url) {
        const img = document.createElement("img");
        img.src = designRow.preview_url;
        img.alt = "Design Preview";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        previewMain.appendChild(img);
    }

    titleEl.textContent = designRow.name || "My Base";
    authorEl.textContent = "Author: " + (author_user_name || "unknown");

    renderCommunityDesignViewer(designRow.design_data);

    copyBtn.onclick = () => {
        const designDataWithId = { ...designRow.design_data };
        delete designDataWithId.projectId;
        localStorage.setItem("pendingBaseDesign", JSON.stringify(designDataWithId));
        window.location.href = "../designBase/index.html";
    };
    previewBox.style.display = "flex"; // Show the preview box
}
window.openCommunityDesignPreview = openCommunityDesignPreview;

document.getElementById("closePreviewBtn").addEventListener("click", () => {
    document.getElementById("designPreviewForCommunity").style.display = "none";
});